from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import RiskOutput
from langchain_core.prompts import ChatPromptTemplate

def risk_assessment_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(RiskOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Startup Risk Assessor. Identify potential technical, financial, legal, and market risks for the startup. Also provide mitigation strategies for each."),
        ("user", "Startup Idea: {startup_idea}\n\nMarket: {market}\n\nFinancial: {financial}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "startup_idea": state["startup_idea"],
        "market": state.get("market", ""),
        "financial": state.get("financial", "")
    })
    
    return {"risk": response}
