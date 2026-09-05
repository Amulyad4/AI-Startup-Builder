from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import MarketingOutput
from langchain_core.prompts import ChatPromptTemplate

def marketing_strategy_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(MarketingOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Startup Chief Marketing Officer (CMO). Develop a comprehensive marketing strategy including branding, key channels, launch plan, customer acquisition, and long-term growth strategy."),
        ("user", "Startup Idea: {startup_idea}\n\nPersona: {persona}\n\nBusiness Model: {business_model}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "startup_idea": state["startup_idea"],
        "persona": state.get("persona", ""),
        "business_model": state.get("business_model", "")
    })
    
    return {"marketing": response}
