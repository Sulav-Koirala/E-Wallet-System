from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.db import connection
from django.contrib.auth.hashers import make_password,check_password
from django.contrib.auth import login,get_user_model

User=get_user_model()

@api_view(['POST'])
def register_user(request):
    required_fields = ['first_name', 'last_name', 'username', 'email', 'password', 'phone_number', 'address']
    missing = [field for field in required_fields if not request.data.get(field)]
    if missing:
        return Response({'error' : f'Missing required fields: {','.join(missing)}'},
                        status = status.HTTP_400_BAD_REQUEST)

    firstname = request.data["first_name"]
    lastname = request.data["last_name"]
    username = request.data["username"]
    email = request.data["email"]
    password = request.data["password"]
    phone_no = request.data["phone_number"]
    address = request.data["address"]

    hashed_pwd = make_password(password)

    with connection.cursor() as cursor:
        cursor.execute('SELECT id FROM ewallet_customuser WHERE email=%s', [email])
        if cursor.fetchone():
            return Response({'error' : 'Email Already Exists'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cursor.execute('''
                INSERT INTO ewallet_customuser (username, email, password, first_name, last_name,
                is_active, is_staff, is_superuser, date_joined, phone_number, address)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s)''',
                [username,email,hashed_pwd,firstname,lastname,True,False,False,phone_no,address])
        except Exception as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        'message' : 'User created successfully'
    }, status=status.HTTP_201_CREATED)                 

@api_view(['POST'])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if not email or not password:
        return Response({'error':'Both fields required'}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        cursor.execute('SELECT id,password FROM ewallet_customuser WHERE email=%s', [email])
        row = cursor.fetchone()
    if row is None:
        return Response({'error':'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    user_id,hashed_pwd = row   
    if not check_password(password,hashed_pwd):
        return Response({'error':'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    user = User.objects.get(id=user_id)
    login(request, user)

    return Response({'message' : 'Login successful'})