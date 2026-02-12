from django.db import connection

def create_Wallet():
    with connection.cursor() as cursor:
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS wallet(
                user_id INT NOT NULL UNIQUE REFERENCES ewallet_customuser(id) ON DELETE CASCADE,
                wallet_id SERIAL PRIMARY KEY,
                status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
                currency VARCHAR(6) NOT NULL DEFAULT 'NPR' CHECK (currency IN ('NPR')),
                balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())
            ''')

def create_Transaction():
    with connection.cursor() as cursor:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transaction(
                wallet_id INT NOT NULL REFERENCES wallet(wallet_id) ON DELETE CASCADE,
                transaction_id SERIAL PRIMARY KEY,
                status VARCHAR(10) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('COMPLETED','PENDING')),
                type VARCHAR(6) NOT NULL CHECK (type IN ('DEPOSITE', 'TRANSFER')),
                amount NUMERIC(10,2) NOT NULL,
                timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW())
            ''')

def create_Notifications():
    with connection.cursor() as cursor:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS notification(
                user_id INT NOT NULL REFERENCES ewallet_customuser(id) ON DELETE CASCADE,
                notification_id SERIAL PRIMARY KEY,
                message VARCHAR(100) NOT NULL,
                type VARCHAR(10) NOT NULL CHECK (type IN ('TRANSACTION', 'SYSTEM', 'ERROR')),
                seen BOOLEAN NOT NULL DEFAULT FALSE, 
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())
            ''')
