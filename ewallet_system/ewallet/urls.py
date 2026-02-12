from django.urls import path
from .api_views import UserApiView

urlpatterns = [
    path("user/", UserApiView.as_view(), name="user"),
]