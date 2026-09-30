import {
  Sparkles,
  Lightbulb,
  Globe,
  Crosshair,
  UserCheck,
  Box,
  Hammer,
  Coins,
  ShieldAlert,
  Rocket,
  Mic,
  Bot
} from "lucide-react";

export const AGENT_META = {
  supervisor: {
    id: "supervisor",
    label: "Supervisor Core",
    name: "Supervisor Core",
    category: "ORCHESTRATOR",
    emoji: "🧠",
    tag: "AGENT.00",
    icon: Bot,
    colorLight: "#0284C7",
    colorDark: "#38BDF8",
    rgb: "56, 189, 248",
    avatarType: "supervisor",
    catchphrase: "Routes work across the swarm",
    desc: "Orchestrates multi-agent routing, parallel synthesis, and blueprint coherence."
  },
  ideaValidation: {
    id: "ideaValidation",
    label: "Idea Validator",
    name: "Idea Validator",
    category: "VALIDATION",
    emoji: "💡",
    tag: "AGENT.01",
    icon: Lightbulb,
    colorLight: "#2563EB",
    colorDark: "#60A5FA",
    rgb: "96, 165, 250",
    avatarType: "owl",
    catchphrase: "Stress-tests your concept",
    desc: "Validates your startup concept for market viability, feasibility, and customer friction."
  },
  marketResearch: {
    id: "marketResearch",
    label: "Market Scout",
    name: "Market Scout",
    category: "MARKET RESEARCH",
    emoji: "🌍",
    tag: "AGENT.02",
    icon: Globe,
    colorLight: "#059669",
    colorDark: "#10B981",
    rgb: "16, 185, 129",
    avatarType: "globe",
    catchphrase: "Maps demand across regions",
    desc: "Analyzes TAM/SAM/SOM market sizing, regional demand vectors, and CAGR forecasts."
  },
  competitorAnalysis: {
    id: "competitorAnalysis",
    label: "Rival Radar",
    name: "Rival Radar",
    category: "COMPETITIVE ANALYSIS",
    emoji: "🎯",
    tag: "AGENT.03",
    icon: Crosshair,
    colorLight: "#EA580C",
    colorDark: "#FB923C",
    rgb: "251, 146, 60",
    avatarType: "radar",
    catchphrase: "Sweeps the landscape",
    desc: "Identifies incumbents, maps defensive moats, and locates unserved market gaps."
  },
  customerPersona: {
    id: "customerPersona",
    label: "Persona Weaver",
    name: "Persona Weaver",
    category: "CUSTOMER PERSONA",
    emoji: "👤",
    tag: "AGENT.04",
    icon: UserCheck,
    colorLight: "#9333EA",
    colorDark: "#C084FC",
    rgb: "192, 132, 252",
    avatarType: "persona",
    catchphrase: "Sculpts your ideal customer",
    desc: "Builds high-resolution ICP profiles, psychological triggers, and jobs-to-be-done."
  },
  businessModel: {
    id: "businessModel",
    label: "Model Architect",
    name: "Model Architect",
    category: "BUSINESS MODEL",
    emoji: "💼",
    tag: "AGENT.05",
    icon: Box,
    colorLight: "#2563EB",
    colorDark: "#38BDF8",
    rgb: "56, 189, 248",
    avatarType: "cube",
    catchphrase: "Designs the revenue engine",
    desc: "Engineers monetization structures, pricing tiers, and unit economics."
  },
  mvpPlanning: {
    id: "mvpPlanning",
    label: "MVP Forge",
    name: "MVP Forge",
    category: "MVP PLANNER",
    emoji: "🏗️",
    tag: "AGENT.06",
    icon: Hammer,
    colorLight: "#65A30D",
    colorDark: "#A3E635",
    rgb: "163, 230, 53",
    avatarType: "builder",
    catchphrase: "Blueprints the first ship",
    desc: "Defines core launch feature scopes, technical stack requirements, and phase rollouts."
  },
  financialPlanning: {
    id: "financialPlanning",
    label: "Coin Oracle",
    name: "Coin Oracle",
    category: "FINANCIAL PLANNING",
    emoji: "💰",
    tag: "AGENT.07",
    icon: Coins,
    colorLight: "#D97706",
    colorDark: "#FBBF24",
    rgb: "251, 191, 36",
    avatarType: "coin",
    catchphrase: "Projects the cash flow",
    desc: "Calculates burn rate, runway, CAC payback periods, and 3-year ARR projections."
  },
  riskAssessment: {
    id: "riskAssessment",
    label: "Sentinel",
    name: "Sentinel",
    category: "RISK ASSESSMENT",
    emoji: "🛡️",
    tag: "AGENT.08",
    icon: ShieldAlert,
    colorLight: "#DC2626",
    colorDark: "#F87171",
    rgb: "248, 113, 113",
    avatarType: "sentinel",
    catchphrase: "Scans for threats",
    desc: "Detects regulatory, platform dependency, financial, and operational vulnerabilities."
  },
  marketingStrategy: {
    id: "marketingStrategy",
    label: "Signal Booster",
    name: "Signal Booster",
    category: "MARKETING STRATEGY",
    emoji: "📢",
    tag: "AGENT.09",
    icon: Rocket,
    colorLight: "#DB2777",
    colorDark: "#F472B6",
    rgb: "244, 114, 182",
    avatarType: "rocket",
    catchphrase: "Fuels the growth engine",
    desc: "Designs zero-CAC acquisition flywheels, viral distribution, and launch playbooks."
  },
  pitchDeck: {
    id: "pitchDeck",
    label: "Deck Maestro",
    name: "Deck Maestro",
    category: "PITCH DECK",
    emoji: "🎤",
    tag: "AGENT.10",
    icon: Mic,
    colorLight: "#7C3AED",
    colorDark: "#A78BFA",
    rgb: "167, 139, 250",
    avatarType: "maestro",
    catchphrase: "Crafts the investor story",
    desc: "Transforms raw data into a 10-slide narrative pitch engineered for venture checks."
  }
};

export const ALL_11_AGENTS = Object.keys(AGENT_META).map((key) => ({
  key: AGENT_META[key].id,
  ...AGENT_META[key],
}));

export function getAgentColor(agentId, isDark = false) {
  const meta = AGENT_META[agentId] || AGENT_META.ideaValidation;
  return isDark ? meta.colorDark : meta.colorLight;
}

