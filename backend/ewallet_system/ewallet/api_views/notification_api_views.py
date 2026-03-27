from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from ewallet.services import notification_services

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_notification(request):
    return notification_services.create_notification(request)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def seen_notification(request,notification_id):
    return notification_services.seen_notification(request,notification_id)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_all_notifications(request):
    return notification_services.view_notification(request)