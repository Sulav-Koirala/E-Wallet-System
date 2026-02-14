from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password,check_password
from django.contrib.auth import login
from rest_framework.exceptions import ValidationError,AuthenticationFailed
from django.core.validators import RegexValidator
from ewallet.repository import user_repo

def create_new_user(request):
    required_fields = ['first_name', 'last_name', 'username', 'email', 'password', 'phone_number', 'address']
    missing = [field for field in required_fields if not request.data.get(field)]
    if missing:
        raise ValidationError({
        "missing_fields": missing,
        "detail": f"Missing required fields: {', '.join(missing)}"
    })

    firstname = request.data["first_name"]
    lastname = request.data["last_name"]
    username = request.data["username"]
    email = request.data["email"]
    password = request.data["password"]
    phone_no = request.data["phone_number"]
    address = request.data["address"]

    hashed_pwd = make_password(password)
    validator = RegexValidator(regex=r'^\+977-9\d{9}$', message="Invalid Nepal phone number")
    validator(phone_no)
    
    if user_repo.email_exists(email):
        raise ValidationError({'error' : 'Email Already Exists'})
    
    try:
        user_repo.create_user(username,email,hashed_pwd,firstname,lastname,phone_no,address)
    except Exception as e:
        raise ValidationError({'error': str(e)})
    
    return Response({
        'message' : 'User created successfully'
    }, status=status.HTTP_201_CREATED) 


def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if not email or not password:
        raise ValidationError({'error':'Both fields required'})

    row = user_repo.check_credentials(email)
    
    if row is None:
        raise AuthenticationFailed({'error':'Invalid Credentials'})
   
    user_id,hashed_pwd = row   
    if not check_password(password,hashed_pwd):
        raise AuthenticationFailed({'error':'Invalid Credentials'})

    user = user_repo.get_user_object(user_id)
    login(request, user)

    return Response({'message' : 'Login successful'})


def update_user_details(request):
    required_fields = ['username','password', 'phone_number', 'address']
    missing = [field for field in required_fields if not request.data.get(field)]
    if missing:
        raise ValidationError({
        "missing_fields": missing,
        "detail": f"Missing required fields: {', '.join(missing)}"
    })
    username = request.data["username"]
    password = request.data["password"]
    phone_no = request.data["phone_number"]
    address = request.data["address"]

    validator = RegexValidator(regex=r'^\+977-9\d{9}$', message="Invalid Nepal phone number")
    validator(phone_no)

    _,hashed_pwd = user_repo.check_credentials(request.user.email)
   
    if not check_password(password,hashed_pwd):
        hash_password=make_password(password)
        user_repo.update_password(hash_password,request.user.id)   
    user_repo.update_details(username,phone_no,address,request.user.id)
    
    return Response({'message':'Successfully updated user info'})
