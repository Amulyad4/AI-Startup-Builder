from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import MVPOutput
from langchain_core.prompts import ChatPromptTemplate

def mvp_planning_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(MVPOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Product Manager for startups. Define the Minimum Viable Product (MVP) strategy. Outline the core features for launch, future features, and development phases."),
        ("user", "Startup Idea: {startup_idea}\n\nBusiness Model: {business_model}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "startup_idea": state["startup_idea"],
        "business_model": state.get("business_model", "")
    })
    
    return {"mvp": response}
