from langgraph.graph import StateGraph, END
from app.graph.state import StartupState
from app.agents.supervisor import supervisor_node, supervisor_finish_node
from app.agents.idea_validation import idea_validation_node
from app.agents.market_research import market_research_node
from app.agents.competitor import competitor_analysis_node
from app.agents.customer_persona import customer_persona_node
from app.agents.business_model import business_model_node
from app.agents.mvp import mvp_planning_node
from app.agents.financial import financial_planning_node
from app.agents.risk import risk_assessment_node
from app.agents.marketing import marketing_strategy_node
from app.agents.pitch_deck import pitch_deck_node

def create_workflow():
    workflow = StateGraph(StartupState)

    # Add all nodes
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("idea_validation", idea_validation_node)
    workflow.add_node("market_research", market_research_node)
    workflow.add_node("competitor", competitor_analysis_node)
    workflow.add_node("customer_persona", customer_persona_node)
    workflow.add_node("business_model", business_model_node)
    workflow.add_node("mvp", mvp_planning_node)
    workflow.add_node("financial", financial_planning_node)
    workflow.add_node("risk", risk_assessment_node)
    workflow.add_node("marketing", marketing_strategy_node)
    workflow.add_node("pitch_deck", pitch_deck_node)
    workflow.add_node("supervisor_finish", supervisor_finish_node)

    # Define edges (Sequential Workflow)
    workflow.set_entry_point("supervisor")
    workflow.add_edge("supervisor", "idea_validation")
    workflow.add_edge("idea_validation", "market_research")
    workflow.add_edge("market_research", "competitor")
    workflow.add_edge("competitor", "customer_persona")
    workflow.add_edge("customer_persona", "business_model")
    workflow.add_edge("business_model", "mvp")
    workflow.add_edge("mvp", "financial")
    workflow.add_edge("financial", "risk")
    workflow.add_edge("risk", "marketing")
    workflow.add_edge("marketing", "pitch_deck")
    workflow.add_edge("pitch_deck", "supervisor_finish")
    workflow.add_edge("supervisor_finish", END)

    # Compile the graph
    app = workflow.compile()
    
    return app

startup_builder_app = create_workflow()
