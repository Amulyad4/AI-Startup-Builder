from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import PitchDeckOutput
from langchain_core.prompts import ChatPromptTemplate

def pitch_deck_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(PitchDeckOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Startup Pitch Coach. Create structured content for a compelling pitch deck based on all the provided startup details. Generate concise, impactful content for each slide."),
        ("user", "Startup Idea: {startup_idea}\n\nValidation: {validation}\n\nMarket: {market}\n\nCompetitors: {competitors}\n\nBusiness Model: {business_model}\n\nFinancials: {financial}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "startup_idea": state["startup_idea"],
        "validation": state.get("validation", ""),
        "market": state.get("market", ""),
        "competitors": state.get("competitors", ""),
        "business_model": state.get("business_model", ""),
        "financial": state.get("financial", "")
    })
    
    return {"pitch": response}
