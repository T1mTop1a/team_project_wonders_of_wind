import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
import django

django.setup()

from project_backend.models import WindmillType

import requests


def get_turbines():
    turbines = []
    result = requests.get('https://openenergy-platform.org/api/v0/schema/supply/tables/wind_turbine_library/rows')
    turbines = list(result.json())
    return turbines


def save_turbines(turbines):
    WindmillType.objects.all().delete()
    for turbine in turbines:

        if turbine['has_power_curve']:
            print(turbine)
            WindmillType.objects.update_or_create(
                modelId=turbine['turbine_id'],
                manufacturer=turbine['manufacturer'],
                model_name=turbine['turbine_type'],
                display_name=turbine['manufacturer'] + " " + turbine['turbine_type'],
                power_curve_input=turbine['power_curve_wind_speeds'],
                power_curve_output=turbine['power_curve_values']
            )


def main():
    turbines = get_turbines()
    save_turbines(turbines)


if __name__ == '__main__':
    main()
