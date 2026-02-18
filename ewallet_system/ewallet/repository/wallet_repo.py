from django.db import connection

def check_wallet_existance(user_id):
    with connection.cursor() as cursor:
        cursor.execute('SELECT EXISTS(SELECT 1 FROM wallet WHERE user_id=%s)',[user_id])
        return cursor.fetchone()[0]

def create_new_wallet(user_id):
    with connection.cursor() as cursor:
        cursor.execute('INSERT INTO wallet (user_id) VALUES (%s)',[user_id])

def select_wallet_by_id(user_id):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM wallet WHERE user_id=%s',[user_id])
        row = cursor.fetchone()
        column = [col[0] for col in cursor.description]
        return column,row

def change_wallet_status(user_id,status):
    with connection.cursor() as cursor:
        cursor.execute('UPDATE wallet SET status=%s WHERE user_id=%s',[status,user_id])

def get_status(user_id):
    with connection.cursor() as cursor:
        cursor.execute('SELECT status FROM wallet WHERE user_id=%s',[user_id])
        return cursor.fetchone()[0]
