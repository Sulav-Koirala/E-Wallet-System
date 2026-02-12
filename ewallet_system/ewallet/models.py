from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class CustomUser(AbstractUser):
    username = models.CharField(max_length=50, unique=False)
    email = models.EmailField(unique=True,null=False)
    phone_number = models.CharField(max_length=10,null=False,unique=True,validators=[RegexValidator(regex=r'^\+977-9\d{9}$')])
    address = models.CharField(max_length=50,null=False)
    USERNAME_FIELD = "email" 
    REQUIRED_FIELDS = ["phone_number"]

    def __str__(self):
        return self.email
