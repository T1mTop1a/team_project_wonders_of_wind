from django.db import models


# Create your models here.


class WeatherData(models.Model):
    weatherId = models.AutoField(primary_key=True)
    height = models.FloatField()
    value_type = models.TextField()
    time = models.DateTimeField()
    source = models.TextField()
    unit_of_measurement = models.TextField()
    location_x = models.IntegerField()
    location_y = models.IntegerField()
    value = models.FloatField()

    # Made source,x,y,time unique
    class Meta:
        unique_together = ('value_type', 'time', 'source', 'location_x', 'location_y')


class WindmillType(models.Model):
    modelId = models.AutoField(primary_key=True)
    model_name = models.TextField()
    power_curve_input = models.JSONField()
    power_curve_output = models.JSONField()


class UserTurbines(models.Model):
    turbineId = models.AutoField(primary_key=True)
    modelId = models.ForeignKey(WindmillType, on_delete=models.PROTECT)
    userId = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    height = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()
