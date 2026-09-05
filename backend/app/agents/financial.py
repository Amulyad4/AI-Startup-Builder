from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import FinancialOutput
from langchain_core.prompts import ChatPromptTemplate

def financial_planning_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(FinancialOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Startup CFO. Create a high-level financial plan based on the business model and MVP. Estimate the initial cost, monthly expenses, expected revenue, break-even point, and return on investment (ROI)."),
        ("user", "Startup Idea: {startup_idea}\n\nBusiness Model: {business_model}\n\nMVP: {mvp}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "startup_idea": state["startup_idea"],
        "business_model": state.get("business_model", ""),
        "mvp": state.get("mvp", "")
    })
    
    return {"financial": response}
