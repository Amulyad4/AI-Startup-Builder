from app.graph.state import StartupState
from app.llm.gemini import get_llm
from app.schemas.startup import IdeaValidationOutput
from langchain_core.prompts import ChatPromptTemplate

def idea_validation_node(state: StartupState) -> StartupState:
    llm = get_llm()
    structured_llm = llm.with_structured_output(IdeaValidationOutput)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert AI Startup Idea Validator. Analyze the given startup idea and provide a structured validation report including problem, solution, feasibility score (0-100), innovation score (0-100), strengths, weaknesses, and suggestions."),
        ("user", "Startup Idea: {startup_idea}")
    ])
    
    chain = prompt | structured_llm
    
    response = chain.invoke({"startup_idea": state["startup_idea"]})
    
    return {"validation": response}
