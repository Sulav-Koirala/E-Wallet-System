from django.urls import path
from ewallet.api_views.user_api_views import register_user,login_user,update_user,view_user,delete_user,logout_user
from ewallet.api_views.wallet_api_views import create_wallet,view_wallet_details,wallet_status

urlpatterns = [
    path("user/register/", register_user, name='register'),
    path("user/login/", login_user, name='login'),
    path("user/update/", update_user, name='update'),
    path("user/profile/", view_user, name='UserProfile'),
    path("user/delete/", delete_user, name='delete'),
    path("user/logout/", logout_user, name='logout'),
    path("wallet/create/", create_wallet, name='create_new_wallet'),
    path("wallet/view/", view_wallet_details, name='get_wallet'),
    path("wallet/status/", wallet_status, name='update_wallet_status'),
]