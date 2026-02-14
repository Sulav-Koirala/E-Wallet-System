from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from ewallet.services import user_services

@api_view(['POST'])
def register_user(request):
    return user_services.create_new_user(request)

@api_view(['POST'])
def login_user(request):
    return user_services.login_user(request)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    return user_services.update_user_details(request)