from django.urls import path
from project_backend import views

app_name = "api/v1/"

urlpatterns = [
    path('', views.index, name='index'),
    path('example_response', views.example_response, name='example_response')
]
