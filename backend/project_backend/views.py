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
from project_backend.models import WindmillType
from django.core import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response

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








@csrf_exempt
def example_response(request):
    enercon_e126 = {
        'turbine_type': 'E-126/4200',  # turbine type as in oedb turbine library
        'hub_height': 135  # in m
    }

    weather_data = pd.read_csv(os.path.join(os.getcwd(), 'project_backend', 'example_weather.csv'),
                               index_col=0,
                               header=[0, 1],
                               date_parser=lambda idx: pd.to_datetime(idx, utc=True)
                               )

    # initialize WindTurbine object
    e126 = ModelChain(WindTurbine(**enercon_e126)).run_model(weather_data)

    response = []
    for date, data in e126.power_output.to_dict().items():
        response.append({"date": str(date), "power": data})

    return JsonResponse(response, safe=False)


@csrf_exempt
def turbines(request):
    data = list(WindmillType.objects.values('model_name', 'modelId'))
    return JsonResponse(data, safe=False)


@api_view(['GET'])
def must_be_logged_in(request):
    print(request.user.is_authenticated)
    return HttpResponse('works')
