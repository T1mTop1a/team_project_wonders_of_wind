from django.urls import path
from project_backend import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = "api/v1/"

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login, name='login'),
    path('signup', views.signup, name='signup'),
    path('example_response', views.example_response, name='example_response'),
    path('turbines', views.turbines, name='turbines'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('must_be_logged_in', views.must_be_logged_in, name='must_be_logged_in'),
    path('add_turbine_to_profile', views.add_turbine_to_profile, name='add_turbine_to_profile'),
    path('userTurbines', views.get_user_turbines, name='get_user_turbines')
]
