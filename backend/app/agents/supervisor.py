from app.graph.state import StartupState

def supervisor_node(state: StartupState) -> StartupState:
    """
    The initial node that just passes the startup idea forward.
    Could be used for initial validation or setup if needed.
    """
    return state

def supervisor_finish_node(state: StartupState) -> StartupState:
    """
    The final node that aggregates all outputs from the agents into a single final dictionary.
    """
    # Extract only the Pydantic models (or dictionaries if serialized) to form the final output
    final_output = {
        "validation": state.get("validation"),
        "market": state.get("market"),
        "competitors": state.get("competitors"),
        "persona": state.get("persona"),
        "business_model": state.get("business_model"),
        "mvp": state.get("mvp"),
        "financial": state.get("financial"),
        "risk": state.get("risk"),
        "marketing": state.get("marketing"),
        "pitch": state.get("pitch")
    }
    
    return {"final_output": final_output}
