from django import forms 
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from project_backend import models
from django.contrib.auth import authenticate

class LoginForm(forms.Form):
    email = forms.CharField(label='email', max_length=128)
    password = forms.CharField(label='password', max_length=128)

    def save(self):
        return authenticate(username=self.cleaned_data['email'], password=self.cleaned_data['password'])

class SignUpForm(forms.Form):
    email = forms.CharField(label='email', max_length=128)
    password = forms.CharField(label='password', max_length=128)
    name = forms.CharField(label='name', max_length=128)
      
    def email_clean(self):  
        email = self.cleaned_data['email'].lower()  
        new = User.objects.filter(email=email)  
        if new.count():  
            raise ValidationError("Email Already Exist")  
        return email  
      
    def password_clean(self):  
        password = self.cleaned_data['password']  
        return password
      
    def save(self, commit = True):  
        user = User.objects.create_user(  
            self.cleaned_data['email'],  
            self.cleaned_data['email'],  
            self.cleaned_data['password'],
            first_name=self.cleaned_data["name"]
        )  
        return user  
