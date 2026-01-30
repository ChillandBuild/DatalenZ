from typing import Dict
from .sandbox import SandboxService

class SessionManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SessionManager, cls).__new__(cls)
            cls._instance.sessions = {} # session_id -> {sandbox: SandboxService, file: str, columns: str}
        return cls._instance

    def get_session(self, session_id: str) -> Dict:
        return self.sessions.get(session_id)

    def create_session(self, session_id: str, sandbox: SandboxService, filename: str, columns: str):
        self.sessions[session_id] = {
            "sandbox": sandbox,
            "filename": filename,
            "columns": columns
        }

    def remove_session(self, session_id: str):
        if session_id in self.sessions:
            try:
                self.sessions[session_id]["sandbox"].stop()
            except:
                pass
            del self.sessions[session_id]

session_manager = SessionManager()
