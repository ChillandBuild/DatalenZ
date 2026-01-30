from pydantic import BaseModel
from typing import List, Optional, Any

class ChatRequest(BaseModel):
    query: str
    session_id: str
    filename: Optional[str] = "dataset.csv"

class ExecutionResult(BaseModel):
    type: str # 'image', 'text', 'stdout', 'stderr'
    content: str

class ChatResponse(BaseModel):
    answer: str
    code: str
    results: List[ExecutionResult]
    error: Optional[str] = None
