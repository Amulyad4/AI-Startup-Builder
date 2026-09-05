from pydantic import BaseModel, Field
from typing import List, Optional

# --- Request/Response Schemas ---

class StartupRequest(BaseModel):
    startup_idea: str = Field(..., description="The initial startup idea from the user")

class IdeaValidationOutput(BaseModel):
    problem: str = Field(description="The core problem the startup solves")
    solution: str = Field(description="The proposed solution")
    feasibility_score: int = Field(ge=0, le=100, description="Score from 0 to 100 on how feasible the idea is")
    innovation_score: int = Field(ge=0, le=100, description="Score from 0 to 100 on how innovative the idea is")
    strengths: List[str] = Field(description="Key strengths of the idea")
    weaknesses: List[str] = Field(description="Key weaknesses of the idea")
    suggestions: List[str] = Field(description="Suggestions for improvement")

class MarketResearchOutput(BaseModel):
    industry: str = Field(description="The industry the startup belongs to")
    market_size: str = Field(description="Estimated market size")
    target_market: str = Field(description="Description of the target market")
    trends: List[str] = Field(description="Current trends in the market")
    opportunities: List[str] = Field(description="Market opportunities")
    challenges: List[str] = Field(description="Market challenges")

class Competitor(BaseModel):
    name: str = Field(description="Name of the competitor")
    strengths: List[str] = Field(description="Strengths of the competitor")
    weaknesses: List[str] = Field(description="Weaknesses of the competitor")
    pricing: str = Field(description="Pricing strategy of the competitor")
    market_gap: str = Field(description="Market gap they are leaving open")

class CompetitorOutput(BaseModel):
    competitors: List[Competitor] = Field(description="List of top competitors")

class CustomerPersonaOutput(BaseModel):
    age: str = Field(description="Target age range")
    occupation: str = Field(description="Target occupation")
    pain_points: List[str] = Field(description="Customer pain points")
    goals: List[str] = Field(description="Customer goals")
    behaviour: str = Field(description="Customer behaviour patterns")
    needs: List[str] = Field(description="Customer needs")

class BusinessModelOutput(BaseModel):
    revenue_model: str = Field(description="How the startup makes money")
    pricing: str = Field(description="Pricing strategy")
    channels: List[str] = Field(description="Distribution channels")
    key_resources: List[str] = Field(description="Key resources needed")
    cost_structure: str = Field(description="Cost structure overview")

class MVPOutput(BaseModel):
    core_features: List[str] = Field(description="Features for the Minimum Viable Product")
    future_features: List[str] = Field(description="Features for future phases")
    development_phases: List[str] = Field(description="Phases of development")

class FinancialOutput(BaseModel):
    estimated_cost: str = Field(description="Estimated initial cost")
    monthly_expense: str = Field(description="Estimated monthly expense")
    expected_revenue: str = Field(description="Expected revenue model/numbers")
    break_even: str = Field(description="Estimated break-even point")
    roi: str = Field(description="Estimated Return on Investment")

class RiskOutput(BaseModel):
    technical_risk: str = Field(description="Technical risks")
    financial_risk: str = Field(description="Financial risks")
    legal_risk: str = Field(description="Legal and compliance risks")
    market_risk: str = Field(description="Market and competitive risks")
    mitigation: List[str] = Field(description="Strategies to mitigate risks")

class MarketingOutput(BaseModel):
    branding: str = Field(description="Branding strategy")
    marketing_channels: List[str] = Field(description="Key marketing channels")
    launch_plan: str = Field(description="Product launch plan")
    customer_acquisition: str = Field(description="Customer acquisition strategy")
    growth_strategy: str = Field(description="Long-term growth strategy")

class PitchDeckOutput(BaseModel):
    title: str = Field(description="Startup Title/Name")
    problem: str = Field(description="The Problem statement")
    solution: str = Field(description="The Solution statement")
    market: str = Field(description="Market slide content")
    competition: str = Field(description="Competition slide content")
    business_model: str = Field(description="Business Model slide content")
    financials: str = Field(description="Financials slide content")
    ask: str = Field(description="The Ask (Investment/Resources)")
    roadmap: str = Field(description="Roadmap slide content")

class StartupResponse(BaseModel):
    validation: Optional[IdeaValidationOutput] = None
    market: Optional[MarketResearchOutput] = None
    competitors: Optional[CompetitorOutput] = None
    persona: Optional[CustomerPersonaOutput] = None
    business_model: Optional[BusinessModelOutput] = None
    mvp: Optional[MVPOutput] = None
    financial: Optional[FinancialOutput] = None
    risk: Optional[RiskOutput] = None
    marketing: Optional[MarketingOutput] = None
    pitch: Optional[PitchDeckOutput] = None

class StartupTaskResponse(BaseModel):
    task_id: str
    status: str = "processing"
    message: str = "Multi-agent swarm has started analyzing your idea."

class StartupStatusResponse(BaseModel):
    task_id: str
    status: str
    error: Optional[str] = None
    result: Optional[StartupResponse] = None

