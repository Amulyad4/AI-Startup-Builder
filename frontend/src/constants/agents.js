import {
  Brain,
  TrendingUp,
  Search,
  Users,
  Target,
  Rocket,
  DollarSign,
  Shield,
  Megaphone,
  Monitor,
  Sparkles
} from "lucide-react";

export const AGENT_META = {
  ideaValidation: {
    id: "ideaValidation",
    label: "Idea Validation",
    tag: "AGENT.01",
    icon: Brain,
    colorLight: "#3B82F6",
    colorDark: "#60A5FA",
    rgb: "59, 130, 246",
    desc: "Validates your startup concept for viability and market readiness."
  },
  marketResearch: {
    id: "marketResearch",
    label: "Market Research",
    tag: "AGENT.02",
    icon: TrendingUp,
    colorLight: "#10B981",
    colorDark: "#34D399",
    rgb: "16, 185, 129",
    desc: "Analyzes market trends, size, and growth potentials."
  },
  competitorAnalysis: {
    id: "competitorAnalysis",
    label: "Competitor Analysis",
    tag: "AGENT.03",
    icon: Search,
    colorLight: "#F59E0B",
    colorDark: "#FBBF24",
    rgb: "245, 158, 11",
    desc: "Identifies competitors and maps your distinct advantage."
  },
  customerPersona: {
    id: "customerPersona",
    label: "Customer Persona",
    tag: "AGENT.04",
    icon: Users,
    colorLight: "#EC4899",
    colorDark: "#F472B6",
    rgb: "236, 72, 153",
    desc: "Creates detailed profiles of your target ideal customer."
  },
  businessModel: {
    id: "businessModel",
    label: "Business Model",
    tag: "AGENT.05",
    icon: Target,
    colorLight: "#6366F1",
    colorDark: "#818CF8",
    rgb: "99, 102, 241",
    desc: "Refines value propositions and revenue monetization strategies."
  },
  mvpPlanning: {
    id: "mvpPlanning",
    label: "MVP Planning",
    tag: "AGENT.06",
    icon: Rocket,
    colorLight: "#EF4444",
    colorDark: "#F87171",
    rgb: "239, 68, 68",
    desc: "Outlines core features to launch a minimal viable product."
  },
  financialPlanning: {
    id: "financialPlanning",
    label: "Financial Planning",
    tag: "AGENT.07",
    icon: DollarSign,
    colorLight: "#EAB308",
    colorDark: "#FACC15",
    rgb: "234, 179, 8",
    desc: "Builds high-level cashflow forecasts and capital requirements."
  },
  riskAssessment: {
    id: "riskAssessment",
    label: "Risk Assessment",
    tag: "AGENT.08",
    icon: Shield,
    colorLight: "#8B5CF6",
    colorDark: "#A78BFA",
    rgb: "139, 92, 246",
    desc: "Uncovers structural, legal, and operational risks."
  },
  marketingStrategy: {
    id: "marketingStrategy",
    label: "Marketing Strategy",
    tag: "AGENT.09",
    icon: Megaphone,
    colorLight: "#A855F7",
    colorDark: "#C084FC",
    rgb: "168, 85, 247",
    desc: "Designs initial traction channels and growth flywheels."
  },
  pitchDeck: {
    id: "pitchDeck",
    label: "Pitch Deck",
    tag: "AGENT.10",
    icon: Monitor,
    colorLight: "#3B82F6",
    colorDark: "#60A5FA",
    rgb: "59, 130, 246",
    desc: "Drafts outline copy and structure for investor pitches."
  },
  supervisor: {
    id: "supervisor",
    label: "Supervisor Agent",
    tag: "SUPERVISOR.00",
    icon: Sparkles,
    colorLight: "#818CF8",
    colorDark: "#A5B4FC",
    rgb: "129, 140, 248",
    desc: "Coordinates specialized agent execution and compiles final report."
  }
};

export function getAgentColor(agentId, isDark = false) {
  const meta = AGENT_META[agentId] || AGENT_META.ideaValidation;
  return isDark ? meta.colorDark : meta.colorLight;
}
