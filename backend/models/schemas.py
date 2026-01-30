from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class ChatRequest(BaseModel):
    query: str
    session_id: str

class Artifact(BaseModel):
    type: str
    content: str
    metadata: Optional[Dict[str, Any]] = None

class ProcessedResult(BaseModel):
    success: bool
    code: str
    stdout: str
    stderr: str
    artifacts: List[Artifact]
    execution_time: float
    retry_count: Optional[int] = 0

class ExecutionPlan(BaseModel):
    steps: List[str]
    estimated_complexity: str
    required_libraries: List[str]

class QueryResponse(BaseModel):
    plan: ExecutionPlan
    result: ProcessedResult
    session_id: str

