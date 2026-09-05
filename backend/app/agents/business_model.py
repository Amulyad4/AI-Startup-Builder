from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import BusinessModelOutput
from langchain_core.prompts import ChatPromptTemplate

def business_model_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(BusinessModelOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Startup Business Strategist. Based on the previous analyses, define a solid business model for the startup. Provide the revenue model, pricing strategy, distribution channels, key resources, and cost structure."),
        ("user", "Startup Idea: {startup_idea}\n\nValidation: {validation}\n\nMarket: {market}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "startup_idea": state["startup_idea"],
        "validation": state.get("validation", ""),
        "market": state.get("market", "")
    })
    
    return {"business_model": response}
