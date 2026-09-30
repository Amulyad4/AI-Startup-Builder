import uuid
import logging
import traceback
from typing import Dict, Any, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, Response
from pydantic import BaseModel
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
from app.services.export import (
    export_blueprint_to_pdf,
    export_blueprint_to_docx,
    export_blueprint_to_markdown,
    get_short_project_name
)

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory storage for active and completed tasks
# Structure: { task_id: { "status": "processing" | "completed" | "failed", "error": str, "result": dict } }
TASKS_DB: Dict[str, Dict[str, Any]] = {}

NODE_META = {
    "idea_validation": {"key": "ideaValidation", "name": "Idea Validation"},
    "market_research": {"key": "marketResearch", "name": "Market Research"},
    "competitor": {"key": "competitorAnalysis", "name": "Competitor Analysis"},
    "customer_persona": {"key": "customerPersona", "name": "Customer Persona"},
    "business_model": {"key": "businessModel", "name": "Business Model"},
    "mvp": {"key": "mvpPlanning", "name": "MVP Planning"},
    "financial": {"key": "financialPlanning", "name": "Financial Planning"},
    "risk": {"key": "riskAssessment", "name": "Risk Assessment"},
    "marketing": {"key": "marketingStrategy", "name": "Marketing Strategy"},
    "pitch_deck": {"key": "pitchDeck", "name": "Pitch Deck"},
}

ORDERED_NODE_KEYS = [
    "idea_validation",
    "market_research",
    "competitor",
    "customer_persona",
    "business_model",
    "mvp",
    "financial",
    "risk",
    "marketing",
    "pitch_deck"
]

def run_workflow_task(task_id: str, startup_idea: str):
    """Background worker function that streams the LangGraph multi-agent workflow."""
    logger.info(f"Starting multi-agent workflow for task {task_id} with idea: '{startup_idea}'")
    db: Session = SessionLocal()
    completed_agents = []
    accumulated_state = {"startup_idea": startup_idea}

    TASKS_DB[task_id] = {
        "status": "processing",
        "error": None,
        "result": None,
        "current_agent": "ideaValidation",
        "current_agent_name": "Idea Validation",
        "completed_agents": [],
        "progress_percent": 5,
    }

    try:
        # Stream each node's output in real-time
        for event in startup_builder_app.stream({"startup_idea": startup_idea}):
            for node_name, node_output in event.items():
                if isinstance(node_output, dict):
                    accumulated_state.update(node_output)

                if node_name in NODE_META:
                    agent_key = NODE_META[node_name]["key"]
                    if agent_key not in completed_agents:
                        completed_agents.append(agent_key)
                    
                    idx = ORDERED_NODE_KEYS.index(node_name)
                    if idx + 1 < len(ORDERED_NODE_KEYS):
                        next_node = ORDERED_NODE_KEYS[idx + 1]
                        current_agent = NODE_META[next_node]["key"]
                        current_name = NODE_META[next_node]["name"]
                    else:
                        current_agent = "supervisor"
                        current_name = "Supervisor Finalizing"

                    pct = min(98, max(10, int((len(completed_agents) / len(ORDERED_NODE_KEYS)) * 100)))
                    TASKS_DB[task_id].update({
                        "completed_agents": list(completed_agents),
                        "current_agent": current_agent,
                        "current_agent_name": current_name,
                        "progress_percent": pct,
                    })

        final_output = accumulated_state.get("final_output")
        if not final_output:
            # Fallback construct final output from accumulated state
            final_output = {
                "validation": accumulated_state.get("validation"),
                "market": accumulated_state.get("market"),
                "competitors": accumulated_state.get("competitors"),
                "persona": accumulated_state.get("persona"),
                "business_model": accumulated_state.get("business_model"),
                "mvp": accumulated_state.get("mvp"),
                "financial": accumulated_state.get("financial"),
                "risk": accumulated_state.get("risk"),
                "marketing": accumulated_state.get("marketing"),
                "pitch": accumulated_state.get("pitch"),
            }

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
        try:
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
            blueprint_id = blueprint_record.id
        except Exception as db_err:
            logger.warning(f"Database save warning (proceeding): {db_err}")
            blueprint_id = None

        all_completed = [NODE_META[k]["key"] for k in ORDERED_NODE_KEYS]
        TASKS_DB[task_id] = {
            "status": "completed",
            "error": None,
            "result": serialized_output,
            "blueprint_id": blueprint_id,
            "current_agent": None,
            "current_agent_name": None,
            "completed_agents": all_completed,
            "progress_percent": 100,
        }
        logger.info(f"Task {task_id} successfully completed all 10 agents!")

    except Exception as e:
        logger.error(f"Task {task_id} failed with error: {str(e)}")
        traceback.print_exc()
        TASKS_DB[task_id] = {
            "status": "failed",
            "error": str(e),
            "result": None,
            "current_agent": None,
            "current_agent_name": None,
            "completed_agents": completed_agents,
            "progress_percent": int((len(completed_agents) / 10) * 100),
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
        result=task.get("result"),
        current_agent=task.get("current_agent"),
        current_agent_name=task.get("current_agent_name"),
        completed_agents=task.get("completed_agents", []),
        progress_percent=task.get("progress_percent", 0),
    )


@router.get("/startup-blueprints")
async def list_blueprints(db: Session = Depends(get_db)):
    """Retrieve all previously generated blueprints from the database."""
    records = db.query(StartupBlueprint).order_by(StartupBlueprint.created_at.desc()).limit(20).all()
    return records


class ExportBlueprintRequest(BaseModel):
    idea: str
    industry: Optional[str] = "SaaS / B2B"
    blueprint_data: Optional[Dict[str, Any]] = None


@router.post("/export-blueprint-pdf")
async def export_blueprint_pdf_route(req: ExportBlueprintRequest):
    """Generate and download a high-resolution, investor-ready PDF matching the reference report."""
    try:
        data = req.blueprint_data or {}
        pdf_bytes = export_blueprint_to_pdf(data, req.idea, req.industry or "SaaS / B2B")
        short_name = get_short_project_name(req.idea)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        filename = f"{short_name}_blueprint_{timestamp}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        logger.error(f"Error generating PDF blueprint: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@router.post("/export-blueprint-docx")
async def export_blueprint_docx_route(req: ExportBlueprintRequest):
    """Generate and download a clean, structured Microsoft Word document (.docx)."""
    try:
        data = req.blueprint_data or {}
        docx_bytes = export_blueprint_to_docx(data, req.idea, req.industry or "SaaS / B2B")
        short_name = get_short_project_name(req.idea)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        filename = f"{short_name}_blueprint_{timestamp}.docx"

        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        logger.error(f"Error generating DOCX blueprint: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"DOCX generation failed: {str(e)}")


@router.post("/export-blueprint-markdown")
async def export_blueprint_markdown_route(req: ExportBlueprintRequest):
    """Generate and download a structured Markdown document (.md)."""
    try:
        data = req.blueprint_data or {}
        md_text = export_blueprint_to_markdown(data, req.idea, req.industry or "SaaS / B2B")
        short_name = get_short_project_name(req.idea)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        filename = f"{short_name}_blueprint_{timestamp}.md"

        return Response(
            content=md_text,
            media_type="text/markdown; charset=utf-8",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        logger.error(f"Error generating Markdown blueprint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Markdown generation failed: {str(e)}")

