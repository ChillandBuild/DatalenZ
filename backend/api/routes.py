import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.sandbox import SandboxService
from services.agent import AgentService
from services.manager import session_manager
from models.schemas import ChatRequest, QueryResponse, ProcessedResult, ExecutionPlan, Artifact

router = APIRouter()
agent_service = AgentService()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), session_id: str = None):
    if not session_id:
        session_id = str(uuid.uuid4())
    
    # 1. Read file content
    content = await file.read()
    
    # 2. Extract columns
    try:
        header_line = content.decode('utf-8').split('\n')[0]
        columns = header_line
    except:
        columns = "Unknown columns"

    # 3. Start/Get Sandbox
    try:
        # Check if session already has a sandbox
        existing_session = session_manager.get_session(session_id)
        if existing_session:
            sandbox = existing_session["sandbox"]
        else:
            sandbox = SandboxService()
            sandbox.start()
        
        # 4. Upload file to Sandbox
        remote_path = sandbox.upload_file("dataset.csv", content)
        
        # 5. Store Session
        session_manager.create_session(session_id, sandbox, "dataset.csv", columns)
        
        return {
            "schema": {"columns": columns.split(',')},
            "filename": file.filename,
            "message": "File uploaded and environment ready."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=QueryResponse)
async def query(request: ChatRequest):
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found. Upload a file first.")
    
    sandbox: SandboxService = session["sandbox"]
    columns = session["columns"]

    # 1. Generate Code
    try:
        code = agent_service.generate_code(request.query, "/home/user/dataset.csv", columns)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent generation failed: {str(e)}")

    if not code:
        return QueryResponse(
            plan=ExecutionPlan(steps=[], estimated_complexity="low", required_libraries=[]),
            result=ProcessedResult(
                success=False,
                code="",
                stdout="",
                stderr="Failed to generate code",
                artifacts=[],
                execution_time=0
            ),
            session_id=request.session_id
        )

    # 2. Execute Code
    try:
        exec_result = sandbox.execute_code(code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")

    # 3. Format Response
    plan = ExecutionPlan(
        steps=["Load dataset", "Clean data", "Execute analysis", "Generate visualization"],
        estimated_complexity="medium",
        required_libraries=["pandas", "plotly"]
    )

    artifacts = [Artifact(**a) for a in exec_result["artifacts"]]

    result = ProcessedResult(
        success=exec_result["success"],
        code=code,
        stdout=exec_result["stdout"],
        stderr=exec_result["stderr"],
        artifacts=artifacts,
        execution_time=exec_result["execution_time"],
        retry_count=0
    )

    return QueryResponse(
        plan=plan,
        result=result,
        session_id=request.session_id
    )

