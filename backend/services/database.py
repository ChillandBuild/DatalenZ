import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class DatabaseService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        
        if not url or not key:
            print("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.")
            self.client = None
            return

        self.client: Client = create_client(url, key)

    def get_client(self) -> Client:
        return self.client

# Singleton accessor
def get_supabase() -> Client:
    return DatabaseService().get_client()
