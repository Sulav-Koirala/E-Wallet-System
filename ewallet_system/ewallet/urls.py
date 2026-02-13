from django.urls import path
from .api_views import register_user,login_user,update_user

urlpatterns = [
    path("user/register/", register_user, name='register'),
    path("user/login/", login_user, name='login'),
    path("user/update/", update_user, name='update'),
]