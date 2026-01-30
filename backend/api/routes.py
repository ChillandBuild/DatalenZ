import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.sandbox import SandboxService
from services.agent import AgentService
from services.manager import session_manager
from models.schemas import ChatRequest, ChatResponse, ExecutionResult

router = APIRouter()
agent_service = AgentService()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    session_id = str(uuid.uuid4())
    
    # 1. Read file content
    content = await file.read()
    
    # 2. Extract columns (simple text parsing to avoid pandas dependency on server)
    try:
        header_line = content.decode('utf-8').split('\n')[0]
        columns = header_line
    except:
        columns = "Unknown columns"

    # 3. Start Sandbox
    try:
        sandbox = SandboxService()
        sandbox.start()
        
        # 4. Upload file to Sandbox
        remote_path = sandbox.upload_file("dataset.csv", content)
        
        # 5. Store Session
        session_manager.create_session(session_id, sandbox, "dataset.csv", columns)
        
        return {
            "session_id": session_id,
            "filename": file.filename,
            "columns": columns,
            "message": "File uploaded and environment ready."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found. Upload a file first.")
    
    sandbox: SandboxService = session["sandbox"]
    columns = session["columns"]
    filename = session["filename"] # In sandbox it is always dataset.csv as per upload logic above

    # 1. Generate Code
    try:
        # We assume file path in sandbox is /home/user/dataset.csv based on upload_file implementation
        code = agent_service.generate_code(request.query, "/home/user/dataset.csv", columns)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent generation failed: {str(e)}")

    if not code:
        return ChatResponse(
            answer="I couldn't generate code for that request.",
            code="",
            results=[]
        )

    # 2. Execute Code
    try:
        exec_result = sandbox.execute_code(code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")

    # 3. Format Response
    # In a real app, we would parse the stdout to find the "answer" logic or have the agent return JSON.
    # Here, we treat everything as results.
    
    formatted_results = []
    # Add Stdout/Stderr as text results
    for log in exec_result.get("logs", []):
        formatted_results.append(ExecutionResult(type=log["type"], content=log["content"]))
    
    # Add Artifacts (Images)
    for res in exec_result.get("results", []):
        formatted_results.append(ExecutionResult(type=res["type"], content=res["content"]))

    return ChatResponse(
        answer="Analysis complete.", # Frontend can infer answer from stdout in 'results'
        code=code,
        results=formatted_results,
        error=exec_result.get("error") and str(exec_result["error"])
    )
