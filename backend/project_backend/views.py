from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseRedirect
from rest_framework.decorators import permission_classes, api_view
from windpowerlib import ModelChain, WindTurbine, create_power_curve
from windpowerlib import data as wt
import io
import pandas as pd
import os
import json
from project_backend import forms
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from urllib.parse import urlparse, urlencode
from project_backend.models import WindmillType, UserTurbines, WeatherData
from django.core import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from django.db.utils import IntegrityError
import datetime
from django.db.models import F, Max, Min


# Create your views here.


def index(request):
    return HttpResponse('hello word')


@csrf_exempt
@api_view(['POST'])
def login(request):
    def unauthorised():
        return Response({
            'error': 'NOT_AUTHORISED'
        }, status=status.HTTP_401_UNAUTHORIZED)

    print('trying to log in for user with', request)
    form = forms.LoginForm(request.POST)
    if not form.is_valid():
        return unauthorised()
    else:
        user = form.save()
        if not user:
            return unauthorised()

        refresh = RefreshToken.for_user(user)

        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])
def signup(request):
    def bad_request():
        return Response({
            'error': 'BAD_REQUEST'
        }, status=status.HTTP_400_BAD_REQUEST)

    form = forms.SignUpForm(request.POST)
    if not form.is_valid():
        return bad_request()
    else:
        try:
            user = form.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return bad_request()


def fetch_weather_data(lat, lon, date):
    [startDate, endDate] = date.split(" - ")
    startDate = pd.to_datetime(startDate, format='%d/%m/%Y')
    endDate = pd.to_datetime(endDate, format='%d/%m/%Y')

    def fetch_subdata(value_type):
        result = WeatherData.objects.filter( \
            time__gte=startDate, \
            time__lte=(endDate + datetime.timedelta(days=1)), \
            location_x=int(lon) + 180, \
            location_y=int(lat) + 90, \
            value_type=value_type
        ).values("time", "value")
        return dict(map(lambda x: (str(x["time"]), x["value"]), result))
    pressure = fetch_subdata("surface_pressure")
    temp = fetch_subdata("temp")
    wind_speed = fetch_subdata("wind_speed")
    file = io.BytesIO()
    file.write(b"variable_name,pressure,temperature,wind_speed,roughness_length\n")
    file.write(b"height,1,1,1,10\n")
    for k in pressure:
        file.write(f"{k},98000,{temp[k]},{wind_speed[k]},0.15\n".encode())
    file.seek(0)
    return pd.read_csv(file, \
        index_col=0, \
        header=[0, 1], \
        date_parser=lambda idx: pd.to_datetime(idx, utc=True))

def predict_turbine_output(lat, lon, date, wind_turbine):
    weather_data = fetch_weather_data(lat, lon, date)
    print(weather_data)

    # initialize WindTurbine object
    e126 = ModelChain(WindTurbine(**wind_turbine), wind_speed_model='hellman').run_model(weather_data)

    response = []
    for date, data in e126.power_output.to_dict().items():
        response.append({"date": str(date), "power": data})

    return JsonResponse(response, safe=False)

@csrf_exempt
def turbine_prediction(request):
    requestBody = json.loads(request.body)
    model = WindmillType.objects.get(modelId=int(requestBody["modelName"]))
    date = requestBody["date"]
    lat = float(requestBody["lat"])
    lon = float(requestBody["lon"])
    wind_turbine = {
        'turbine_type': model.model_name,  # turbine type as in oedb turbine library
        'hub_height': 135  # in m
    }
    return predict_turbine_output(lat, lon, date, wind_turbine)

@csrf_exempt
@permission_classes([IsAuthenticated])
def saved_turbine_prediction(request):
    requestBody = json.loads(request.body)
    date = requestBody["date"]
    turbineId = int(requestBody["turbineId"])
    turbine = UserTurbines.objects.get(turbineId=turbineId)
    model = turbine.modelId
    wind_turbine = {
        'turbine_type': model.model_name,  # turbine type as in oedb turbine library
        'hub_height': turbine.height  # in m
    }
    return predict_turbine_output(turbine.latitude, turbine.longitude, date, wind_turbine)

@csrf_exempt
def turbines(request):
    data = list(WindmillType.objects.values('display_name', 'modelId'))
    return JsonResponse(data, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_turbine_to_profile(request):
    try:
        turbineModel = WindmillType.objects.get(pk=request.POST['turbineModel'])
        print(turbineModel)
        turbineEditId = request.POST.get("turbineId")
        try:
            if turbineEditId:
                turbine = UserTurbines.objects.get(turbineId=turbineEditId, userId=request.user)
            else:
                turbine = UserTurbines(userId=request.user)
            turbine.modelId=turbineModel
            turbine.latitude=request.POST['turbineLatitude']
            turbine.longitude=request.POST['turbineLongitude']
            turbine.height=request.POST['turbineHeight']
            turbine.name=request.POST['turbineName']
            turbine.save()

        except IntegrityError as ie:
            print(ie)
            return JsonResponse({"error": f"{turbine.name} already exists"}, status=status.HTTP_400_BAD_REQUEST)
    except WindmillType.DoesNotExist as dne:
        print(dne)
        return JsonResponse({"error": f"Invalid windmill type"}, status=status.HTTP_400_BAD_REQUEST)


    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_turbines(request):
    user_turbines = list(UserTurbines.objects.filter(userId=request.user).values('turbineId', 'height', 'latitude', 'longitude', 'name').annotate(
        turbineModel=F('modelId__display_name'),
        turbineModelId=F('modelId')
    ))
    return JsonResponse(user_turbines, safe=False)


@api_view(['GET'])
def must_be_logged_in(request):
    return HttpResponse(f'works, is logged in: {request.user.is_authenticated}')

def prediction_date_range(request):
    latest_time = WeatherData.objects.aggregate(Max('time'))["time__max"]
    earliest_time = WeatherData.objects.aggregate(Min('time'))["time__min"]
    return JsonResponse({"maxDate": latest_time, "minDate": earliest_time}, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_turbine(request):
    body = json.loads(request.body)
    UserTurbines.objects.get(userId=request.user, turbineId=body["turbineId"]).delete()
    return Response(status=status.HTTP_200_OK)

