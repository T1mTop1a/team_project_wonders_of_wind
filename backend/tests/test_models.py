from django.test import TestCase
from datetime import datetime
from project_backend.models import WeatherData, WindmillType, UserTurbines

from django.contrib.auth.models import User
import json


class WeatherDataTestCase(TestCase):
    def setUp(self):
        # create a weather data instance
        self.weather_data = WeatherData.objects.create(
            height=100.0,
            value_type="test type",
            time= datetime.now(),
            source="test source",
            unit_of_measurement="test measurement",
            location_x=0,
            location_y=0,
            value=20.0,
        )

    def test_weather_data_created(self):
        # check if the weather data was created successfully
        self.assertTrue(WeatherData.objects.exists())

    def test_weather_data_str(self):
        # check the string representation of the weather data
        self.assertEqual(str(self.weather_data), "WeatherData 1")


    def test_unique_together(self):
        # check if the unique_together constraint is working
        with self.assertRaises(Exception):
            WeatherData.objects.create(
                height=100.0,
                value_type="test type",
                time= datetime.now(),
                source="test source",
                unit_of_measurement="test measurement",
                location_x=0,
                location_y=0,
                value=20.0,
            )



class WindmillTypeTestCase(TestCase):
    def setUp(self):
        WindmillType.objects.create(
            model_name = "test name",
            power_curve_input = json.dumps({"input_1" : 1, "input_2" : 10}),
            power_curve_output = json.dumps({"output_1" : 2, "output_2" : 20})
        )

    def test_model_created(self):
        self.windmill_type = WindmillType.objects.get(model_name="test_name")
        self.assertEqual(self.windmill_type.model_name, "test_name")
        self.assertEqual(self.windmill_type.power_curve_input, {"input_1": 1, "input_2": 10})
        self.assertEqual(self.windmill_type.power_curve_output, {"output_1": 2, "output_2": 20})

    def test_windmill_type_str(self):
        # check the string representation of the windmill type
        self.assertEqual(str(self.windmill_type), "WindmillType 1")

    def test_windmill_type_fields(self):
        # check if the fields of the windmill type were set correctly
        self.assertEqual(self.windmill_type.model_name, "test name")
        self.assertEqual(self.windmill_type.power_curve_input, {"input_1": 1, "input_2": 10})
        self.assertEqual(self.windmill_type.power_curve_output, {"output_1": 2, "output_2": 20})


class UserTurbinesTestCase(TestCase):
    def setUp(self):
        # create a windmill type to be referenced by the user turbine
        windmill_type = WindmillType.objects.create(
            model_name="Test Windmill",
            power_curve_input={},
            power_curve_output={},
        )

        # create a user to be referenced by the user turbine
        user = User.objects.create_user(
            username="testuser",
            password="testpassword",
        )

        # create a user turbine instance
        self.user_turbine = UserTurbines.objects.create(
            modelId=windmill_type,
            userId=user,
            height=100.0,
            latitude=0.0,
            longitude=0.0,
        )

    def test_user_turbine_created(self):
        # check if the user turbine was created successfully
        self.assertTrue(UserTurbines.objects.exists())

    def test_user_turbine_str(self):
        # check the string representation of the user turbine
        self.assertEqual(str(self.user_turbine), "UserTurbine 1")

    def test_user_turbine_fields(self):
        # check if the fields of the user turbine were set correctly
        self.assertEqual(self.user_turbine.modelId.model_name, "Test Windmill")
        self.assertEqual(self.user_turbine.userId.username, "testuser")
        self.assertEqual(self.user_turbine.height, 100.0)
        self.assertEqual(self.user_turbine.latitude, 0.0)
        self.assertEqual(self.user_turbine.longitude, 0.0)