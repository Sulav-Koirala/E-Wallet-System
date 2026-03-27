from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from ewallet.services import transaction_services

@api_view(['POST'])
@permission_classes([IsAdminUser])
def load_wallet(request):
    return transaction_services.load_wallet(request)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def transfer_money(request,wallet_id):
    return transaction_services.transfer_money(request,wallet_id)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_transaction_statement(request):
    return transaction_services.view_statements(request)
