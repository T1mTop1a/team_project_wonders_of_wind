from project_backend import models
from django.contrib import admin
from .models import UserTurbines, WindmillType, WeatherData

admin.site.register(UserTurbines)
admin.site.register(WindmillType)
admin.site.register(WeatherData)
