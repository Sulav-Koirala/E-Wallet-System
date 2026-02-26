from django.db import connection,transaction

@transaction.atomic
def load_wallet(user_id, wallet_id, load_amount, new_balance, reference_id):
    with connection.cursor() as cursor:
        cursor.execute('''INSERT INTO transaction (wallet_id,status,type,amount,reference_id)
                        VALUES (%s, %s, %s, %s, %s)''', [wallet_id, "COMPLETED", "DEPOSITE", load_amount, reference_id])
        cursor.execute('UPDATE wallet SET balance=%s WHERE wallet_id=%s',[new_balance,wallet_id])
        cursor.execute('''INSERT INTO notification (user_id,message,type,reference_id)
                        VALUES (%s,%s,%s,%s)''', [user_id,f"Wallet loaded successfully with amount NRs. {load_amount}","TRANSACTION",reference_id])

def failed_transaction(user_id):
    with connection.cursor() as cursor:
        cursor.execute('''INSERT INTO notification (user_id,message,type)
                        VALUES (%s,%s,%s)''', [user_id,"Transaction failed","ERROR"])
    
@transaction.atomic    
def transfer_money(sender_user_id, receiver_user_id, sender_wallet_id, receiver_wallet_id, transfer_amount, sender_balance, receiver_balance, reference_id):
    with connection.cursor() as cursor:
        cursor.execute('''INSERT INTO transaction (wallet_id,status,type,amount,reference_id)
                        VALUES (%s, %s, %s, %s, %s)''', [sender_wallet_id, "COMPLETED", "TRANSFER", transfer_amount,reference_id])
        cursor.execute('''INSERT INTO transaction (wallet_id,status,type,amount,reference_id)
                        VALUES (%s, %s, %s, %s, %s)''', [receiver_wallet_id, "COMPLETED", "DEPOSITE", transfer_amount,reference_id])
        cursor.execute('UPDATE wallet SET balance=%s WHERE wallet_id=%s',[sender_balance,sender_wallet_id])
        cursor.execute('UPDATE wallet SET balance=%s WHERE wallet_id=%s',[receiver_balance,receiver_wallet_id])
        cursor.execute('''INSERT INTO notification (user_id,message,type,reference_id)
                        VALUES (%s,%s,%s,%s)''', [sender_user_id,f"Transferred NRs. {transfer_amount} to wallet {receiver_wallet_id} successfully","TRANSACTION",reference_id])
        cursor.execute('''INSERT INTO notification (user_id,message,type,reference_id)
                        VALUES (%s,%s,%s,%s)''', [receiver_user_id,f"Received NRs. {transfer_amount} from wallet {sender_wallet_id} successfully","TRANSACTION",reference_id])

def get_transaction_history(wallet_id):
    with connection.cursor() as cursor:
        cursor.execute('''SELECT t.transaction_id,t.status,t.type,t.amount,t.reference_id,su.username AS sender,ru.username AS receiver,t.timestamp AS transaction_date
                        FROM transaction t JOIN transaction t2 ON t.reference_id = t2.reference_id AND t.wallet_id <> t2.wallet_id
                        JOIN wallet sw ON ((t.type = 'TRANSFER' AND sw.wallet_id = t.wallet_id) OR (t.type = 'DEPOSITE' AND sw.wallet_id = t2.wallet_id))
                        JOIN wallet rw ON ((t.type = 'TRANSFER' AND rw.wallet_id = t2.wallet_id) OR (t.type = 'DEPOSITE' AND rw.wallet_id = t.wallet_id))
                        JOIN ewallet_customuser su ON su.id = sw.user_id JOIN ewallet_customuser ru ON ru.id = rw.user_id
                        WHERE t.wallet_id = %s ORDER BY t.timestamp DESC''',[wallet_id])
        return cursor.fetchall()
