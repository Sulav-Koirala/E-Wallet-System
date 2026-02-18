from ewallet.repository import wallet_repo
from rest_framework.exceptions import APIException,ValidationError
from rest_framework.response import Response
from rest_framework import status

def new_wallet(request):
    wallet_exists = wallet_repo.check_wallet_existance(request.user.id)
    if wallet_exists:
        raise ValidationError({'error': 'The user already has a wallet'})
    try:
        wallet_repo.create_new_wallet(request.user.id)
    except Exception as e:
        raise APIException({'error':str(e)})
    return Response({'message':'Wallet created successfully'},status=status.HTTP_201_CREATED)

def get_wallet_details(request):
    column,row = wallet_repo.select_wallet_by_id(request.user.id)
    if row is None:
        raise ValidationError({'error': 'This user has no wallet currently'})
    result_dict = dict(zip(column,row))
    return Response(result_dict)

def update_wallet(request):
    user_id = request.data.get("user_id")
    status = request.data.get("status")
    wallet_exists = wallet_repo.check_wallet_existance(user_id)
    if not wallet_exists:
        raise ValidationError("This user doesn't have a wallet") 
    current_status = wallet_repo.get_status(user_id)
    if current_status==status:
        raise ValidationError(f"Couldn't change status as this wallet is currently {status}")
    try:
        wallet_repo.change_wallet_status(user_id,status)
    except Exception as e:
        raise APIException({'error':str(e)})
    return Response({'message':'Wallet status successfully changed'})
