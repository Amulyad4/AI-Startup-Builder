from typing import TypedDict, Optional
from app.schemas.startup import (
    IdeaValidationOutput, MarketResearchOutput, CompetitorOutput,
    CustomerPersonaOutput, BusinessModelOutput, MVPOutput,
    FinancialOutput, RiskOutput, MarketingOutput, PitchDeckOutput
)

class StartupState(TypedDict):
    startup_idea: str
    validation: Optional[IdeaValidationOutput]
    market: Optional[MarketResearchOutput]
    competitors: Optional[CompetitorOutput]
    persona: Optional[CustomerPersonaOutput]
    business_model: Optional[BusinessModelOutput]
    mvp: Optional[MVPOutput]
    financial: Optional[FinancialOutput]
    risk: Optional[RiskOutput]
    marketing: Optional[MarketingOutput]
    pitch: Optional[PitchDeckOutput]
    final_output: Optional[dict]
