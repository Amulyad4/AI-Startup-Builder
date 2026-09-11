from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import CustomerPersonaOutput
from langchain_core.prompts import ChatPromptTemplate

def customer_persona_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(CustomerPersonaOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert User Researcher. Define a detailed customer persona for the startup idea. Include age, occupation, pain points, goals, behavior patterns, and specific needs."),
        ("user", "Startup Idea: {startup_idea}\n\nMarket Research: {market}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "startup_idea": state["startup_idea"],
        "market": state.get("market", "")
    })
    
    return {"persona": response}
