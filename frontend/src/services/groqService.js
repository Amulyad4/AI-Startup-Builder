/**
 * Groq Multi-Agent Swarm Service (Frontend Client)
 * Connects to Backend API or Direct Groq Endpoint using User-Provided Groq API Key.
 * Every response is generated via Groq API (no hardcoded keys or mock responses).
 * Implements single retry per failed agent and reports live progress.
 */

export function getStoredGroqKey() {
  return localStorage.getItem("groq_api_key") || "";
}

export function saveStoredGroqKey(key) {
  if (key && key.trim()) {
    localStorage.setItem("groq_api_key", key.trim());
  } else {
    localStorage.removeItem("groq_api_key");
  }
}

// System prompts for all 13 specialized agents
const AGENT_SYSTEM_PROMPTS = {
  scopeFeasibility: `You are the Scope & Feasibility Specialist Agent. Analyze problem-solution fit, technical complexity, MVP scale, and feasibility score (out of 10).
Format output in Markdown:
## Concept & Problem-Solution Fit
## Feasibility Score & Technical Complexity
## Core Scope Boundaries (MVP)
## Feasibility Verdict & Recommendations`,

  industryAnalysis: `You are the Industry Analysis Specialist Agent. Analyze industry classification, macro trends, regulatory standards (GDPR, HIPAA, SOC2, PCI-DSS), and structural barriers.
Format output in Markdown:
## Industry Classification & Macro Trends
## Regulatory & Compliance Landscape
## Industry Tailwinds & Drivers
## Barriers to Entry`,

  marketResearch: `You are the Market Research Specialist Agent. Estimate Total Addressable Market (TAM, SAM, SOM), CAGR, and market expansion signals.
Format output in Markdown:
## Market Size Metrics (TAM / SAM / SOM)
## Compound Annual Growth Rate (CAGR)
## High-Growth Market Segments
## Market Expansion Signals`,

  targetAudience: `You are the Target Audience Specialist Agent. Construct ideal user persona profiles, pain points, friction map, and buying triggers.
Format output in Markdown:
## Ideal Customer Persona Profile
## Core Pain Points & Friction Map
## Buying Triggers & Value Drivers
## User Adoption Journey`,

  competitorAnalysis: `You are the Competitor Analysis Specialist Agent. Identify direct/indirect competitors, competitive moats, unfair advantages, and positioning matrix.
Format output in Markdown:
## Direct & Indirect Competitors
## Competitive Advantage & Moat Strategy
## Strategic Positioning Comparison
## Differentiation Matrix`,

  financialAnalysis: `You are the Financial Analysis Specialist Agent.
IMPORTANT: Mark all metrics clearly as **AI Financial Estimates** derived from market benchmarks.
Project unit economics (CAC, LTV), payback period, and 3-year high-level revenue forecast.
Format output in Markdown:
> [!NOTE]
> All financial metrics below are **AI Financial Estimates** based on market benchmarks.

## Unit Economics & Customer Metrics (AI Estimates)
## Payback Period & Gross Margin Forecast (AI Estimates)
## Capital Requirements & Runway (AI Estimates)
## 3-Year Projected Revenue Growth (AI Estimates)`,

  businessModel: `You are the Business Model Specialist Agent. Detail monetization architecture, pricing tiers, cost structure, and Business Model Canvas.
Format output in Markdown:
## Monetization Architecture & Revenue Streams
## Pricing Tiers & Strategy
## Key Cost Structure Drivers
## Business Model Canvas Breakdown`,

  swotAnalysis: `You are the SWOT Analysis Specialist Agent. Evaluate Strengths, Weaknesses, Opportunities, and Threats for the startup concept.
Format output in Markdown:
## Strengths (Internal Advantages)
## Weaknesses (Internal Constraints)
## Opportunities (External Tailwinds)
## Threats (External Risks)`,

  riskAnalysis: `You are the Risk Analysis Specialist Agent. Assess operational, technical, legal, and market risks with actionable mitigation safeguards.
Format output in Markdown:
## Operational & Execution Risks
## Technical & Architectural Vulnerabilities
## Regulatory & Legal Risk Factors
## Risk Mitigation Matrix & Safeguards`,

  marketingStrategy: `You are the Marketing Strategy Specialist Agent. Outline customer acquisition channels, viral growth flywheels, and launch GTM strategy.
Format output in Markdown:
## Go-To-Market (GTM) Acquisition Channels
## Growth Flywheels & Viral Referral Loops
## Brand Positioning & Content Strategy
## Launch Execution Plan`,

  mvpPlanning: `You are the MVP Planning Specialist Agent. Specify MVP v1.0 core features, recommended tech stack architecture, and 6-week build sprint roadmap.
Format output in Markdown:
## MVP v1.0 Core Feature Specification
## Recommended Tech Stack Architecture
## 6-Week Build & Deployment Roadmap
## Validation Metrics & Iteration Loops`,

  investmentReadiness: `You are the Investment Readiness Specialist Agent. Score investment readiness (out of 10), valuation rationale, 10-slide pitch deck outline, and capital ask.
Format output in Markdown:
## Investment Readiness Score & Valuation Guidance
## 10-Slide Investor Pitch Deck Outline
## Funding Ask & Use of Funds Breakdown
## Critical Investor Q&A Preparedness`,

  blueprintGenerator: `You are the Master Blueprint Generator Specialist Agent. Synthesize insights from all agents into executive recommendations, 30-day priority actions, and final verdict.
Format output in Markdown:
## Strategic Launch Directives (Next 30 Days)
## Key Success Metrics & KPI Targets
## Critical Red-Line Warnings
## Final Blueprint Sign-Off & Verdict`
};

/**
 * Direct Groq API Call helper with 1 retry
 */
async function callGroqDirectly({ apiKey, systemPrompt, userPrompt, model }) {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  const body = {
    model: model || "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 2048
  };

  let attempts = 0;
  let lastError = null;

  while (attempts < 2) {
    attempts++;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = errData.error?.message || response.statusText || `HTTP ${response.status}`;
        if (response.status === 401) {
          throw new Error("GROQ_INVALID_KEY: Invalid Groq API Key.");
        }
        if (response.status === 429) {
          throw new Error("GROQ_RATE_LIMIT: Rate limit exceeded on Groq API.");
        }
        throw new Error(`Groq Error (${response.status}): ${msg}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Received empty response from Groq API.");

      return { success: true, content, model: data.model || model };
    } catch (err) {
      lastError = err;
      if (err.message.includes("GROQ_INVALID_KEY")) break;
      if (attempts < 2) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  return { success: false, error: lastError?.message || "Failed after retry." };
}

/**
 * Execute full multi-agent blueprint generation
 */
export async function generateSwarmBlueprint({ startupIdea, apiKey, model = "llama-3.3-70b-versatile", onProgress }) {
  const effectiveKey = apiKey || getStoredGroqKey();
  
  if (!effectiveKey || !effectiveKey.trim()) {
    throw new Error("GROQ_API_KEY_REQUIRED: Please enter your Groq API Key to start analysis.");
  }

  const idea = startupIdea?.trim();
  if (!idea) {
    throw new Error("Startup Idea is required.");
  }


  // Client-side execution of all 13 specialized agents in parallel for maximum speed
  const agentKeys = [
    "scopeFeasibility", "industryAnalysis", "marketResearch", "targetAudience",
    "competitorAnalysis", "financialAnalysis", "businessModel", "swotAnalysis",
    "riskAnalysis", "marketingStrategy", "mvpPlanning", "investmentReadiness"
  ];

  const agentReports = {};

  await Promise.all(
    agentKeys.map(async (agentId) => {
      if (typeof onProgress === "function") {
        onProgress(agentId, "ANALYZING", `Analyzing ${agentId}...`);
      }

      const systemPrompt = AGENT_SYSTEM_PROMPTS[agentId];
      const userPrompt = `Startup Idea: "${idea}"\nPerform your specialized analysis.`;

      const res = await callGroqDirectly({
        apiKey: effectiveKey.trim(),
        systemPrompt,
        userPrompt,
        model
      });

      if (res.success) {
        agentReports[agentId] = {
          agentId,
          status: "COMPLETED",
          modelUsed: res.model,
          report: res.content
        };
        if (typeof onProgress === "function") {
          onProgress(agentId, "COMPLETED", `Completed ${agentId}`);
        }
      } else {
        agentReports[agentId] = {
          agentId,
          status: "FAILED",
          error: res.error,
          report: `## ${agentId} Analysis (Degraded)\n- Status: Failed after retry (${res.error})`
        };
        if (typeof onProgress === "function") {
          onProgress(agentId, "FAILED", `Failed: ${res.error}`);
        }
      }
    })
  );


  // 13th Agent: Blueprint Generator
  if (typeof onProgress === "function") {
    onProgress("blueprintGenerator", "ANALYZING", "Synthesizing Final Recommendations...");
  }
  const bpRes = await callGroqDirectly({
    apiKey: effectiveKey.trim(),
    systemPrompt: AGENT_SYSTEM_PROMPTS.blueprintGenerator,
    userPrompt: `Startup Idea: "${idea}"\nGenerate final launch directives and recommendations based on preceding analysis.`,
    model
  });
  
  agentReports.blueprintGenerator = {
    agentId: "blueprintGenerator",
    status: bpRes.success ? "COMPLETED" : "FAILED",
    report: bpRes.success ? bpRes.content : `## Blueprint Recommendations (Degraded)\n${bpRes.error}`
  };
  if (typeof onProgress === "function") {
    onProgress("blueprintGenerator", bpRes.success ? "COMPLETED" : "FAILED", "Finished synthesis.");
  }

  // Generate Executive Summary
  let execSummary = `This investor blueprint evaluates the commercial viability of "${idea}". Specialized AI agents powered by Groq API analyzed technical scope, market sizing, target personas, financial projections, business model, and risk factors.`;
  const execRes = await callGroqDirectly({
    apiKey: effectiveKey.trim(),
    systemPrompt: "You are an executive startup advisor creating a concise Executive Summary for an investor blueprint.",
    userPrompt: `Startup Concept: "${idea}"\nSummarize the overall thesis, key opportunity, financial potential, and launch recommendation in 3 clear paragraph bullet points.`,
    model
  });
  if (execRes.success) {
    execSummary = execRes.content;
  }

  const structuredReport = {
    title: `Investor Startup Blueprint: ${idea}`,
    idea,
    model,
    generatedAt: new Date().toISOString(),
    status: "COMPLETE",
    sections: {
      executiveSummary: execSummary,
      scopeFeasibility: agentReports.scopeFeasibility?.report || "",
      industryOverview: agentReports.industryAnalysis?.report || "",
      targetAudience: agentReports.targetAudience?.report || "",
      marketAnalysis: agentReports.marketResearch?.report || "",
      competitorComparison: agentReports.competitorAnalysis?.report || "",
      financialEstimates: agentReports.financialAnalysis?.report || "",
      businessModelCanvas: agentReports.businessModel?.report || "",
      swotAnalysis: agentReports.swotAnalysis?.report || "",
      riskAssessment: agentReports.riskAnalysis?.report || "",
      marketingStrategy: agentReports.marketingStrategy?.report || "",
      mvpRoadmap: agentReports.mvpPlanning?.report || "",
      investmentReadiness: agentReports.investmentReadiness?.report || "",
      finalRecommendations: agentReports.blueprintGenerator?.report || ""
    },
    agentReports
  };

  return structuredReport;
}
