from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseRedirect
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

# Create your views here.


def index(request):
    return HttpResponse('hello word')

@csrf_exempt
def login(request):
    if request.method != "POST":
        return HttpResponseBadRequest()
    referer = request.META.get('HTTP_REFERER')
    if not referer:
        return HttpResponseBadRequest()
    referer = urlparse(referer)._replace(path = '/login')
    try:
        form = forms.LoginForm(request.POST)
        if not form.is_valid():
            raise Exception()
        try:
            user = form.save()
            if not user:
                raise Exception()
            # TODO: do something with user
        except Exception as e:
            referer = referer._replace(path = '/login', query = 'error=wrongCredentials').geturl()
            return HttpResponseRedirect(referer)
        referer = referer._replace(path = '/').geturl()
        return HttpResponseRedirect(referer)
    except:
        referer = referer._replace(path = '/login', query = 'error=unknownError').geturl()
        return HttpResponseRedirect(referer)


@csrf_exempt
def signup(request):
    if request.method != "POST":
        return HttpResponseBadRequest()
    referer = request.META.get('HTTP_REFERER')
    if not referer:
        return HttpResponseBadRequest()
    referer = urlparse(referer)._replace(path = '/signup')
    try:
        form = forms.SignUpForm(request.POST)
        if not form.is_valid():
            raise Exception()
        try:
            form.save()
        except Exception as e:
            referer = referer._replace(path = '/signup', query = 'error=alreadyExists').geturl()
            return HttpResponseRedirect(referer)
        referer = referer._replace(path = '/').geturl()
        return HttpResponseRedirect(referer)
    except:
        referer = referer._replace(path = '/signup', query = 'error=unknownError').geturl()
        return HttpResponseRedirect(referer)


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
