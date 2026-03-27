from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from ewallet.services import wallet_services

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_wallet(request):
    return wallet_services.new_wallet(request)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_wallet_details(request):
    return wallet_services.get_wallet_details(request)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def wallet_status(request):
    return wallet_services.update_wallet(request)