from rest_framework.exceptions import APIException,ValidationError
from ewallet.repository import transaction_repo,wallet_repo
from rest_framework.response import Response
import uuid

def req_fields(request):
    required_field = ["amount"]
    missing = [field for field in required_field if not request.data.get(field)]
    if missing:
        raise ValidationError({
        "missing_field": missing,
        "detail": f"Missing required field: {missing}"
    })

def check_wallet_validity(user_id):
    wallet = wallet_repo.check_wallet_existance(user_id)
    if wallet is None:
        raise ValidationError({'error': 'the user has no wallet'})
    wallet_status = wallet_repo.get_status(user_id)
    if wallet_status == "INACTIVE":
        raise ValidationError({'eror': 'the wallet is currently inactive, contact the admin for further details'})
    return wallet

def load_wallet(request):
    req_fields(request)
    wallet = check_wallet_validity(request.user.id)
    amount = request.data["amount"]
    old_balance = wallet_repo.get_wallet_balance(wallet)
    new_balance = old_balance+amount
    ref_id = uuid.uuid4()
    try:
        transaction_repo.load_wallet(request.user.id, wallet, amount, new_balance,ref_id)
    except Exception as e:
        transaction_repo.failed_transaction(request.user.id)
        raise APIException({'error': str(e)})
    return Response({'message': 'Wallet loaded successfully'})

def transfer_money(request,wallet_id):
    req_fields(request)
    sender_wallet = check_wallet_validity(request.user.id)
    if not wallet_repo.wallet_is_valid(wallet_id):
        raise ValidationError({'error': 'cannot transfer to a non existing or inactive wallet'})
    receiver_user_id = wallet_repo.get_user_id(wallet_id)
    receiver_balance = wallet_repo.get_wallet_balance(wallet_id)
    sender_balance = wallet_repo.get_wallet_balance(sender_wallet)
    amount = request.data["amount"]
    if sender_balance<=amount:
        raise ValidationError({'error': 'amount is higher than balance'})
    sender_balance = sender_balance-amount
    receiver_balance = receiver_balance+amount
    ref_id = uuid.uuid4()
    try:
        transaction_repo.transfer_money(request.user.id, receiver_user_id, sender_wallet, wallet_id, amount, sender_balance, receiver_balance, ref_id)
    except Exception as e:
        transaction_repo.failed_transaction(request.user.id)
        raise APIException({'error': str(e)})
    return Response({'message': 'Transfer successful'})

def view_statements(request):
    if request.user.is_superuser:
        return Response({'message': 'admins cannot view their statement'})
    keys = ["transaction_id","status","type","amount","reference_id","sender","receiver","transaction_date"]
    user_wallet = check_wallet_validity(request.user.id)
    try:
        rows = transaction_repo.get_transaction_history(user_wallet)
        transactions = []
        for row in rows:
            transactions.append(dict(zip(keys,row)))
        return Response(transactions)
    except Exception as e:
        raise APIException({'error': str(e)})