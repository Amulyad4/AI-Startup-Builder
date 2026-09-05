from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import CompetitorOutput
from langchain_core.prompts import ChatPromptTemplate

def competitor_analysis_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(CompetitorOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Competitor Analyst for startups. Based on the startup idea and market research, identify the top competitors. Provide their name, strengths, weaknesses, pricing, and the market gap they are leaving open."),
        ("user", "Startup Idea: {startup_idea}\n\nMarket Research: {market}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "startup_idea": state["startup_idea"],
        "market": state.get("market", "")
    })
    
    return {"competitors": response}
