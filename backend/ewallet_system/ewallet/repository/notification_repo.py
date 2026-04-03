from django.db import connection,transaction

def check_user(user_id):
    with connection.cursor() as cursor:
        cursor.execute('SELECT EXISTS(SELECT 1 FROM ewallet_customuser WHERE id=%s)',[user_id])
        return cursor.fetchone()[0]
    
def send_notification(user_id,message):
    with connection.cursor() as cursor:
        cursor.execute('INSERT INTO notification (user_id,message,type) VALUES (%s,%s,%s)', [user_id,message,'SYSTEM'])

def check_notification(notification_id):
    with connection.cursor() as cursor:
        cursor.execute('SELECT user_id FROM notification WHERE notification_id=%s',[notification_id])
        row = cursor.fetchone()
        if row is None:
            return None
        return row[0]

@transaction.atomic
def see_notification(notification_id):
    with connection.cursor() as cursor:
        cursor.execute('UPDATE notification SET seen=%s WHERE notification_id=%s',[True,notification_id])
        cursor.execute('SELECT notification_id,message,type,created_at FROM notification WHERE notification_id=%s',[notification_id])
        return cursor.fetchone()

@transaction.atomic
def get_all_notifications(user_id):
    with connection.cursor() as cursor:
        cursor.execute('UPDATE notification SET seen=%s WHERE user_id=%s',[True,user_id])
        cursor.execute('SELECT notification_id,message,type,created_at FROM notification WHERE user_id=%s ORDER BY created_at DESC',[user_id])
        return cursor.fetchall()
