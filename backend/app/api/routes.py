import uuid
import logging
import traceback
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app.models.startup import StartupBlueprint
from app.schemas.startup import (
    StartupRequest, 
    StartupResponse, 
    StartupTaskResponse, 
    StartupStatusResponse
)
from app.graph.workflow import startup_builder_app

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory storage for active and completed tasks
# Structure: { task_id: { "status": "processing" | "completed" | "failed", "error": str, "result": dict } }
TASKS_DB: Dict[str, Dict[str, Any]] = {}

def run_workflow_task(task_id: str, startup_idea: str):
    """Background worker function that runs the LangGraph multi-agent workflow."""
    logger.info(f"Starting multi-agent workflow for task {task_id} with idea: '{startup_idea}'")
    db: Session = SessionLocal()
    try:
        initial_state = {"startup_idea": startup_idea}
        result_state = startup_builder_app.invoke(initial_state)
        final_output = result_state.get("final_output")

        if not final_output:
            raise ValueError("Workflow finished but final_output was empty.")

        # Serialize Pydantic objects if needed
        serialized_output = {}
        for key, val in final_output.items():
            if hasattr(val, "model_dump"):
                serialized_output[key] = val.model_dump()
            elif hasattr(val, "dict"):
                serialized_output[key] = val.dict()
            else:
                serialized_output[key] = val

        # Persist to database
        blueprint_record = StartupBlueprint(
            idea=startup_idea,
            validation=serialized_output.get("validation"),
            market=serialized_output.get("market"),
            competitors=serialized_output.get("competitors"),
            persona=serialized_output.get("persona"),
            business_model=serialized_output.get("business_model"),
            mvp=serialized_output.get("mvp"),
            financial=serialized_output.get("financial"),
            risk=serialized_output.get("risk"),
            marketing=serialized_output.get("marketing"),
            pitch=serialized_output.get("pitch"),
        )
        db.add(blueprint_record)
        db.commit()
        db.refresh(blueprint_record)

        TASKS_DB[task_id] = {
            "status": "completed",
            "error": None,
            "result": serialized_output,
            "blueprint_id": blueprint_record.id
        }
        logger.info(f"Task {task_id} successfully completed and saved with ID {blueprint_record.id}")

    except Exception as e:
        logger.error(f"Task {task_id} failed with error: {str(e)}")
        traceback.print_exc()
        TASKS_DB[task_id] = {
            "status": "failed",
            "error": str(e),
            "result": None
        }
    finally:
        db.close()


@router.post("/generate-startup", response_model=Any)
async def generate_startup(
    request: StartupRequest, 
    background_tasks: BackgroundTasks,
    sync: bool = Query(False, description="Run synchronously and wait for complete result"),
    db: Session = Depends(get_db)
):
    """
    Initiate the multi-agent startup builder workflow.
    By default (sync=False), runs as an asynchronous background task and returns task_id for polling.
    If sync=True, waits for the entire workflow and returns the final blueprint directly.
    """
    task_id = str(uuid.uuid4())

    if sync:
        try:
            initial_state = {"startup_idea": request.startup_idea}
            result_state = startup_builder_app.invoke(initial_state)
            final_output = result_state.get("final_output")

            if not final_output:
                raise HTTPException(status_code=500, detail="Failed to generate startup blueprint")

            serialized_output = {}
            for key, val in final_output.items():
                serialized_output[key] = val.model_dump() if hasattr(val, "model_dump") else val

            blueprint_record = StartupBlueprint(
                idea=request.startup_idea,
                validation=serialized_output.get("validation"),
                market=serialized_output.get("market"),
                competitors=serialized_output.get("competitors"),
                persona=serialized_output.get("persona"),
                business_model=serialized_output.get("business_model"),
                mvp=serialized_output.get("mvp"),
                financial=serialized_output.get("financial"),
                risk=serialized_output.get("risk"),
                marketing=serialized_output.get("marketing"),
                pitch=serialized_output.get("pitch"),
            )
            db.add(blueprint_record)
            db.commit()
            db.refresh(blueprint_record)

            return serialized_output
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    # Asynchronous mode (recommended for production and frontend polling)
    TASKS_DB[task_id] = {
        "status": "processing",
        "error": None,
        "result": None
    }
    background_tasks.add_task(run_workflow_task, task_id, request.startup_idea)

    return StartupTaskResponse(
        task_id=task_id,
        status="processing",
        message="Multi-agent swarm has started analyzing your idea."
    )


@router.get("/startup-status/{task_id}", response_model=StartupStatusResponse)
async def get_startup_status(task_id: str):
    """
    Check the current processing status of a startup ideation task.
    Status can be: 'processing', 'completed', or 'failed'.
    """
    task = TASKS_DB.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task ID '{task_id}' not found.")

    return StartupStatusResponse(
        task_id=task_id,
        status=task["status"],
        error=task.get("error"),
        result=task.get("result")
    )


@router.get("/startup-blueprints")
async def list_blueprints(db: Session = Depends(get_db)):
    """Retrieve all previously generated blueprints from the database."""
    records = db.query(StartupBlueprint).order_by(StartupBlueprint.created_at.desc()).limit(20).all()
    return records
