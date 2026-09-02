/**
 * BotTipsEngine is the context-aware intelligence system for the AI mascot.
 * Analyzes application state, current route, form completion, and handles quick actions.
 */

export function getContextAwareTip(routeKey, intakeData = {}) {
  const idea = intakeData?.idea || "";
  const problem = intakeData?.problem || "";
  const audience = intakeData?.audience || "";
  const industry = intakeData?.industry || "SaaS / B2B";

  switch (routeKey) {
    case "questions":
    case "idea": {
      if (!idea.trim()) {
        return {
          emotion: "encouraging",
          title: "Stage 1 · Concept Intake",
          message: "💡 Welcome Founder! Start by describing your startup concept above to initiate your multi-agent analysis!",
          actionLabel: "Start Intake",
          suggestedAction: "focus_input"
        };
      }
      if (idea.trim().length < 30) {
        return {
          emotion: "concerned",
          title: "Stage 1 · Brief Concept Detected",
          message: "👀 Your concept is quite brief! Adding a bit more detail about what your product does will help our 10 AI agents generate much deeper blueprints.",
          actionLabel: "Improve Concept",
          suggestedAction: "improve_concept"
        };
      }
      if (idea.trim().length > 100) {
        return {
          emotion: "surprised",
          title: "Stage 1 · Excellent Detail!",
          message: "😮✨ Impressive concept description! You've provided great context for the AI Swarm. Ready to select your 10 specialist agents?",
          actionLabel: "Proceed to Agent Selection →",
          suggestedAction: "proceed_select"
        };
      }
      if (!audience.trim()) {
        return {
          emotion: "encouraging",
          title: "Stage 1 · Target Audience Tip",
          message: "🎯 Pro tip: Specifying who experiences this problem helps our Market Research agent calculate exact TAM and SAM figures!",
          actionLabel: "Define Audience",
          suggestedAction: "define_audience"
        };
      }
      return {
        emotion: "happy",
        title: "Stage 1 · Looking Great!",
        message: "🎉 Your concept intake is coming along nicely! Click 'Select AI Specialist Agents' to assemble your AI founding team.",
        actionLabel: "Proceed to Selection →",
        suggestedAction: "proceed_select"
      };
    }

    case "select": {
      return {
        emotion: "encouraging",
        title: "Stage 2 · Agent Roster",
        message: "🚀 Choose all 10 specialist agents (Market Research, Financial Model, Pitch Deck, Risk Audit) for a complete investor blueprint!",
        actionLabel: "Select All 10 Agents",
        suggestedAction: "select_all_agents"
      };
    }

    case "results":
    case "dashboard": {
      return {
        emotion: "celebrating",
        title: "Stage 3 · Investor Blueprint Ready!",
        message: "🎉 Woohoo! Your multi-agent swarm analysis is synthesized! Inspect Key Stat Flashcards, Market Graphs, and 10-slide Pitch Deck outlines below.",
        actionLabel: "Export Blueprint",
        suggestedAction: "export_report"
      };
    }

    case "history": {
      return {
        emotion: "happy",
        title: "Blueprint History",
        message: "📚 Here are your saved startup executions. You can reopen any past thread or launch a fresh concept intake!",
        actionLabel: "New Intake",
        suggestedAction: "new_intake"
      };
    }

    case "settings":
    case "profile": {
      return {
        emotion: "encouraging",
        title: "Account & AI Roster Settings",
        message: "⚙️ Customize agent parameters or manage your founder profile settings here.",
        actionLabel: "Back to Workspace",
        suggestedAction: "go_dashboard"
      };
    }

    default: {
      return {
        emotion: "happy",
        title: "AI Co-Founder Companion",
        message: "👋 Hi Founder! Ready to build something epic today? Click me anytime for startup guidance and quick AI actions!",
        actionLabel: "Start Intake",
        suggestedAction: "new_intake"
      };
    }
  }
}

// Handler for 8 Quick Action queries
export function handleQuickAction(actionId, intakeData = {}) {
  const idea = intakeData?.idea || "Your Startup Concept";
  const industry = intakeData?.industry || "SaaS / B2B";

  switch (actionId) {
    case "give_idea":
      return {
        emotion: "surprised",
        title: "💡 Startup Idea Recommendation",
        text: `Here are 3 high-potential trending market spaces in **${industry}**:\n\n1. **Autonomous Operations**: AI agents optimizing multi-cloud, server, and compute workloads.\n2. **Smart FinTech Infrastructure**: Automated cross-border invoicing and instant settlement protocols.\n3. **Intelligent Workflow Automation**: Direct LLM-powered vertical tooling for enterprise operations.`,
        action: "focus_input"
      };

    case "improve_concept":
      return {
        emotion: "encouraging",
        title: "🔍 Concept Refinement",
        text: `To make **"${idea.slice(0, 45)}..."** investor-ready, sharpen these 3 elements:\n\n• **Core Pain**: Quantify customer loss (e.g. "losing 30% margin to middlemen").\n• **Secret Sauce**: State your unique technical moat (e.g. "proprietary predictive matching").\n• **Monetization**: State clearly who pays (e.g. "12% marketplace fee").`,
        action: "focus_input"
      };

    case "analyze_market":
      return {
        emotion: "thinking",
        title: "📊 Market Telemetry Quick Analysis",
        text: `Based on your **${industry}** cluster:\n\n• **TAM (Global)**: ~$24.5B - $42.0B\n• **SAM (Serviceable)**: ~$5.8B - $9.4B\n• **CAGR Growth Rate**: 18.4% - 22.3% / year\n\n*Run the Market Research Agent for precise sub-segment breakdown!*`,
        action: "run_agents"
      };

    case "target_audience":
      return {
        emotion: "encouraging",
        title: "🎯 Target Audience Framework",
        text: `For your startup, focus on this primary buyer profile:\n\n• **Primary Buyer**: VP of Operations / Founder in ${industry}.\n• **Urgent Pain Point**: Frustrated by manual handoffs and high overhead fees.\n• **Willingness to Pay**: High, if payback period is under 4 months.\n\n*Add this profile to your concept intake form!*`,
        action: "focus_audience"
      };

    case "business_model":
      return {
        emotion: "thinking",
        title: "💰 Business Model & Revenue Strategy",
        text: `Recommended monetization model:\n\n• **Primary Stream**: Tiered SaaS ($49/mo Starter, $199/mo Growth, $499/mo Enterprise).\n• **Secondary Stream**: 1.5% transaction processing fee.\n• **Gross Margin Target**: 82% - 86%\n• **Conversion Flywheel**: 14-day free trial converting at ~12%.`,
        action: "run_agents"
      };

    case "next_steps":
      return {
        emotion: "happy",
        title: "🚀 Recommended Next Action",
        text: `Here is your optimal roadmap:\n\n1. Complete Concept Intake (Idea, Problem, Audience)\n2. Select all 10 Specialist AI Agents\n3. Run Swarm Execution & Review Pitch Deck Slides\n4. Export Complete Investor Blueprint Report!`,
        action: "proceed"
      };

    case "find_weaknesses":
      return {
        emotion: "concerned",
        title: "⚠️ Risk Scan & Vulnerability Check",
        text: `Potential risks to validate early for **${industry}**:\n\n1. **Customer Acquisition Cost (CAC)**: High ad spend if relying on generic social ads. Use direct outbound cold email.\n2. **Incumbent Response**: Legacy providers may discount fees. Emphasize speed & 10x UX.\n3. **Regulatory**: Verify data privacy (GDPR / ISO 27001) compliance early.`,
        action: "run_agents"
      };

    case "pro_tip":
    default:
      return {
        emotion: "celebrating",
        title: "✨ AI Founder Pro Tip",
        text: `*"Build fast, validate willingness-to-pay before scaling."*\n\nThe #1 mistake founders make is building feature-heavy apps before testing if customers will pay \$1 for the core assumption. Use your AI Startup Blueprint to validate unit economics first!`,
        action: "none"
      };
  }
}
