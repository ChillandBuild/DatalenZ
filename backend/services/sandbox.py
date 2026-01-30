import os
import base64
from typing import List, Dict, Any, Optional
from e2b_code_interpreter import Sandbox
from dotenv import load_dotenv

load_dotenv()

class SandboxService:
    def __init__(self, sandbox_id: Optional[str] = None):
        self.api_key = os.environ.get("E2B_API_KEY")
        if not self.api_key:
            raise ValueError("E2B_API_KEY not found in environment variables")
        
        # If sandbox_id is provided, we could try to resume (not supported in simple mode usually, 
        # seeing as Sandbox.create() makes a new one). 
        # For this version, we'll create a new sandbox for each session or keep one alive.
        # Ideally, we should persist sandbox IDs in the database and reconnect.
        # For simplicity in this step, we will assume a new sandbox or managing the instance.
        self.sandbox = None

    def start(self):
        """Starts a new E2B sandbox."""
        print("Starting E2B Sandbox...")
        self.sandbox = Sandbox(api_key=self.api_key)
        return self.sandbox.sandbox_id

    def upload_file(self, file_name: str, file_content: bytes):
        """Uploads a file to the sandbox working directory."""
        if not self.sandbox:
            raise RuntimeError("Sandbox not started")
        
        # E2B Sandbox has a filesystem. We can write to it.
        # The upload_file method expects a file-like object or bytes.
        remote_path = f"/home/user/{file_name}"
        self.sandbox.files.write(remote_path, file_content)
        return remote_path

    def execute_code(self, code: str) -> Dict[str, Any]:
        """Executes Python code in the sandbox and returns the result."""
        if not self.sandbox:
            raise RuntimeError("Sandbox not started")

        import time
        start_time = time.time()
        execution = self.sandbox.run_code(code)
        execution_time = time.time() - start_time
        
        # Parse results
        artifacts = []
        for result in execution.results:
            if result.png:
                artifacts.append({"type": "image/png", "content": result.png})
            elif result.jpeg:
                artifacts.append({"type": "image/jpeg", "content": result.jpeg})
            elif result.text:
                artifacts.append({"type": "text/plain", "content": result.text})

        stdout = "\n".join(execution.logs.stdout)
        stderr = "\n".join(execution.logs.stderr)

        return {
            "success": execution.error is None,
            "stdout": stdout,
            "stderr": stderr,
            "artifacts": artifacts,
            "execution_time": execution_time,
            "error": execution.error
        }

    def stop(self):
        """Kills the sandbox."""
        if self.sandbox:
            self.sandbox.kill()
            self.sandbox = None
