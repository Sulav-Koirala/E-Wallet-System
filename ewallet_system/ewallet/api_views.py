from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from rest_framework.response import Response
from django.db import connection
from django.contrib.auth.hashers import make_password,check_password
from django.contrib.auth import login,get_user_model
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

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
    validator = RegexValidator(regex=r'^\+977-9\d{9}$', message="Invalid Nepal phone number")
    try:
        validator(phone_no)
    except ValidationError as e:
        return Response({'error': str(e)}, status=400)
    
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

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    required_fields = ['username','password', 'phone_number', 'address']
    missing = [field for field in required_fields if not request.data.get(field)]
    if missing:
        return Response({'error' : f'Missing required fields: {','.join(missing)}'},
                        status = status.HTTP_400_BAD_REQUEST)
    username = request.data["username"]
    password = request.data["password"]
    phone_no = request.data["phone_number"]
    address = request.data["address"]

    validator = RegexValidator(regex=r'^\+977-9\d{9}$', message="Invalid Nepal phone number")
    try:
        validator(phone_no)
    except ValidationError as e:
        return Response({'error': str(e)}, status=400)

    with connection.cursor() as cursor:
        cursor.execute("SELECT password FROM ewallet_customuser WHERE id=%s", [request.user.id])
        hashed_pwd_tuple = cursor.fetchone()
        hashed_pwd = hashed_pwd_tuple[0]
        if not check_password(password,hashed_pwd):
            hash_password=make_password(password)
            cursor.execute("UPDATE ewallet_customuser SET password=%s WHERE id=%s", [hash_password,request.user.id])
        cursor.execute('''UPDATE ewallet_customuser SET username=%s,
            phone_number=%s, address=%s WHERE id=%s''', [username,phone_no,address,request.user.id])
    
    return Response({'message':'Successfully updated user info'})