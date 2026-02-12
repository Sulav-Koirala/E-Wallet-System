from django.core.management.base import BaseCommand
from ewallet.db_helpers import create_Wallet,create_Transaction,create_Notifications

class Command(BaseCommand):
    help = 'Initializes the database tables for the wallet app'
    def handle(self,*args,**options):
        create_Wallet()
        create_Transaction()
        create_Notifications()
        self.stdout.write(self.style.SUCCESS('Database initialized successfully'))