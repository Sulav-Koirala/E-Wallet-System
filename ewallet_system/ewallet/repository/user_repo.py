from django.db import connection
from django.contrib.auth import get_user_model

User=get_user_model()

def email_exists(email):
     with connection.cursor() as cursor:
        cursor.execute('SELECT id FROM ewallet_customuser WHERE email=%s', [email])
        return cursor.fetchone() is not None

def create_user(username,email,hashed_pwd,firstname,lastname,phone_no,address):
    with connection.cursor() as cursor:
        cursor.execute('''
            INSERT INTO ewallet_customuser (username, email, password, first_name, last_name,
            is_active, is_staff, is_superuser, date_joined, phone_number, address)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s)''',
            [username,email,hashed_pwd,firstname,lastname,True,False,False,phone_no,address])
        
def check_credentials(email):
    with connection.cursor() as cursor:
        cursor.execute('SELECT id,password FROM ewallet_customuser WHERE email=%s', [email])
        return cursor.fetchone()
    
def get_user_object(user_id):
    return User.objects.get(id=user_id)

def update_password(hash_password,user_id):
    with connection.cursor() as cursor:
        cursor.execute("UPDATE ewallet_customuser SET password=%s WHERE id=%s", [hash_password,user_id])

def update_details(username,phone_no,address,user_id):
    with connection.cursor() as cursor:
        cursor.execute('''UPDATE ewallet_customuser SET username=%s,
            phone_number=%s, address=%s WHERE id=%s''', [username,phone_no,address,user_id])