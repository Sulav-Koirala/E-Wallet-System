from rest_framework.exceptions import APIException,ValidationError
from ewallet.repository import notification_repo
from rest_framework.response import Response

def create_notification(request):
    required_fields = ["user_id","message"]
    missing = [field for field in required_fields if not request.data.get(field)]
    if missing:
        raise ValidationError({
            "missing fields" : missing,
            "detail" : f"Missing required fields: {missing}"
        })
    user_id = request.data["user_id"]
    message = request.data["message"]
    check_user_exists = notification_repo.check_user(user_id)
    if not check_user_exists:
        raise ValidationError({'error':f'no such user of id {user_id}'})
    try:
        notification_repo.send_notification(user_id,message)
    except Exception as e:
        raise APIException({'error': str(e)})
    return Response({'message': f'Notification sent to user {user_id} successfully'})

def seen_notification(request,notification_id):
    user_notification_exists = notification_repo.check_notification(notification_id)
    if not user_notification_exists:
        raise ValidationError({'error':f'no notification of id {notification_id} exists'})
    if user_notification_exists != request.user.id:
        raise ValidationError({'error': 'you do not have a notification of this id'})
    try:
        column = ["notification_id","message","type","created_at"]
        row = notification_repo.see_notification(notification_id)
        result = dict(zip(column,row))
        return Response(result)
    except Exception as e:
        raise APIException({'error': str(e)})

def view_notification(request):
    column = ["notification_id","message","type","created_at"]
    try:
        rows = notification_repo.get_all_notifications(request.user.id)
        if not rows:
            raise ValidationError({'error':'no notifications till now'})
        notifications = []
        for row in rows:
            notifications.append(dict(zip(column,row)))
        return Response(notifications)
    except Exception as e:
        raise APIException({'error': str(e)})
