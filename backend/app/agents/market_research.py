from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import MarketResearchOutput
from langchain_core.prompts import ChatPromptTemplate

def market_research_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(MarketResearchOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Market Research Analyst for startups. Based on the startup idea and validation report, provide a comprehensive market research analysis including industry, market size, target market, trends, opportunities, and challenges."),
        ("user", "Startup Idea: {startup_idea}\n\nValidation Report: {validation}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "startup_idea": state["startup_idea"],
        "validation": state.get("validation", "")
    })
    
    return {"market": response}
