/**
 * Backend API Client for AI Startup Builder
 * Communicates with FastAPI backend running on http://localhost:8000
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Initiates the asynchronous multi-agent startup generation workflow.
 * @param {string} startupIdea
 * @returns {Promise<{task_id: string, status: string}>}
 */
export async function startStartupGeneration(startupIdea) {
  const response = await fetch(`${API_BASE_URL}/generate-startup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ startup_idea: startupIdea })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to start generation (${response.status})`);
  }

  return await response.json();
}

/**
 * Checks the status of an ongoing generation task.
 * @param {string} taskId
 * @returns {Promise<{task_id: string, status: string, error?: string, result?: object}>}
 */
export async function checkStartupStatus(taskId) {
  const response = await fetch(`${API_BASE_URL}/startup-status/${taskId}`, {
    headers: { "Accept": "application/json" }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to check task status (${response.status})`);
  }

  return await response.json();
}

/**
 * Polls the backend until the task completes or fails.
 * @param {string} taskId
 * @param {Function} onProgress
 * @param {number} intervalMs
 * @param {number} maxAttempts
 * @returns {Promise<object>}
 */
export async function pollStartupStatus(taskId, onProgress = () => {}, intervalMs = 2500, maxAttempts = 180) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const data = await checkStartupStatus(taskId);
    onProgress(data);

    if (data.status === "completed") {
      return data.result;
    }

    if (data.status === "failed") {
      throw new Error(data.error || "Generation task encountered an error.");
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Generation timed out. Please try again.");
}

/**
 * Converts the backend's structured JSON output into the formatted Markdown text
 * that the frontend DashboardPage and components expect.
 */
export function formatBackendBlueprintToReports(blueprint) {
  if (!blueprint) return {};

  const v = blueprint.validation || {};
  const m = blueprint.market || {};
  const c = blueprint.competitors?.competitors || [];
  const p = blueprint.persona || {};
  const b = blueprint.business_model || {};
  const mvp = blueprint.mvp || {};
  const f = blueprint.financial || {};
  const r = blueprint.risk || {};
  const mkt = blueprint.marketing || {};
  const pt = blueprint.pitch || {};

  return {
    ideaValidation: `## AGENT.01 · Idea Validation Strategy
- **Core Problem**: ${v.problem || "N/A"}
- **Proposed Solution**: ${v.solution || "N/A"}
- **Feasibility Score**: ${v.feasibility_score !== undefined ? `${v.feasibility_score} / 100` : "N/A"}
- **Innovation Score**: ${v.innovation_score !== undefined ? `${v.innovation_score} / 100` : "N/A"}
- **Key Strengths**:
${(v.strengths || []).map((s) => `  • ${s}`).join("\n")}
- **Key Weaknesses**:
${(v.weaknesses || []).map((w) => `  • ${w}`).join("\n")}
- **Actionable Suggestions**:
${(v.suggestions || []).map((s) => `  • ${s}`).join("\n")}`,

    marketResearch: `## AGENT.02 · Market Research Telemetry
- **Industry Cluster**: ${m.industry || "N/A"}
- **Estimated Market Size**: ${m.market_size || "N/A"}
- **Target Market Definition**: ${m.target_market || "N/A"}
- **Key Industry Trends**:
${(m.trends || []).map((t) => `  • ${t}`).join("\n")}
- **Emerging Opportunities**:
${(m.opportunities || []).map((o) => `  • ${o}`).join("\n")}
- **Market Challenges**:
${(m.challenges || []).map((ch) => `  • ${ch}`).join("\n")}`,

    competitorAnalysis: `## AGENT.03 · Competitive Landscape & Moats
${c.length > 0 ? c.map((comp, idx) => `### Competitor ${idx + 1}: ${comp.name}
- **Pricing Strategy**: ${comp.pricing || "N/A"}
- **Market Gap**: ${comp.market_gap || "N/A"}
- **Strengths**: ${(comp.strengths || []).join(", ")}
- **Weaknesses**: ${(comp.weaknesses || []).join(", ")}`).join("\n\n") : "- **Competitor Overview**: No direct incumbents found; open market opportunity."}`,

    customerPersona: `## AGENT.04 · Customer Persona Blueprint
- **Target Demographic**: Age ${p.age || "N/A"} · ${p.occupation || "N/A"}
- **Core Pain Points**:
${(p.pain_points || []).map((pt) => `  • ${pt}`).join("\n")}
- **Key Goals & Desired Outcomes**:
${(p.goals || []).map((g) => `  • ${g}`).join("\n")}
- **Behavioral Patterns**: ${p.behaviour || "N/A"}
- **Essential Needs**:
${(p.needs || []).map((n) => `  • ${n}`).join("\n")}`,

    businessModel: `## AGENT.05 · Business Model & Revenue Architecture
- **Revenue Model**: ${b.revenue_model || "N/A"}
- **Pricing Strategy**: ${b.pricing || "N/A"}
- **Cost Structure**: ${b.cost_structure || "N/A"}
- **Distribution Channels**:
${(b.channels || []).map((ch) => `  • ${ch}`).join("\n")}
- **Key Resources**:
${(b.key_resources || []).map((res) => `  • ${res}`).join("\n")}`,

    mvpPlanning: `## AGENT.06 · MVP Product Feature Specification
- **Core Launch Features (Phase 1)**:
${(mvp.core_features || []).map((feat) => `  • ${feat}`).join("\n")}
- **Future Capabilities (Phase 2+)**:
${(mvp.future_features || []).map((ff) => `  • ${ff}`).join("\n")}
- **Development Roadmap Phases**:
${(mvp.development_phases || []).map((dp) => `  • ${dp}`).join("\n")}`,

    financialPlanning: `## AGENT.07 · Financial Forecast & Unit Economics
- **Estimated Initial Capital Needed**: ${f.estimated_cost || "N/A"}
- **Estimated Monthly Operating Expenses**: ${f.monthly_expense || "N/A"}
- **Expected Revenue Projections**: ${f.expected_revenue || "N/A"}
- **Estimated Break-Even Horizon**: ${f.break_even || "N/A"}
- **Projected Return on Investment (ROI)**: ${f.roi || "N/A"}`,

    riskAssessment: `## AGENT.08 · Risk Assessment & Compliance Checklist
- **Technical Risks**: ${r.technical_risk || "N/A"}
- **Financial Risks**: ${r.financial_risk || "N/A"}
- **Legal & Regulatory Risks**: ${r.legal_risk || "N/A"}
- **Market & Adoption Risks**: ${r.market_risk || "N/A"}
- **Key Mitigation Strategies**:
${(r.mitigation || []).map((mit) => `  • ${mit}`).join("\n")}`,

    marketingStrategy: `## AGENT.09 · Growth & Marketing Flywheel
- **Branding & Positioning**: ${mkt.branding || "N/A"}
- **Launch Plan**: ${mkt.launch_plan || "N/A"}
- **Customer Acquisition Strategy**: ${mkt.customer_acquisition || "N/A"}
- **Long-term Growth Strategy**: ${mkt.growth_strategy || "N/A"}
- **Priority Marketing Channels**:
${(mkt.marketing_channels || []).map((ch) => `  • ${ch}`).join("\n")}`,

    pitchDeck: `## AGENT.10 · Investor Pitch Deck Outline
- **Slide 1 · Title & Vision**: ${pt.title || "AI Startup"}
- **Slide 2 · The Problem**: ${pt.problem || "N/A"}
- **Slide 3 · The Solution**: ${pt.solution || "N/A"}
- **Slide 4 · Market Opportunity**: ${pt.market || "N/A"}
- **Slide 5 · Competitive Moat**: ${pt.competition || "N/A"}
- **Slide 6 · Business & Revenue Model**: ${pt.business_model || "N/A"}
- **Slide 7 · Financial Projections**: ${pt.financials || "N/A"}
- **Slide 8 · The Ask / Funding**: ${pt.ask || "N/A"}
- **Slide 9 · Milestones & Roadmap**: ${pt.roadmap || "N/A"}`,

    _raw: blueprint
  };
}
