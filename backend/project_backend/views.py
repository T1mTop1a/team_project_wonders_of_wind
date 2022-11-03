from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from windpowerlib import ModelChain, WindTurbine, create_power_curve
from windpowerlib import data as wt
import io
import pandas as pd
import os
import json
from django.views.decorators.csrf import csrf_exempt


# Create your views here.


def index(request):
    return HttpResponse('hello word')


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
