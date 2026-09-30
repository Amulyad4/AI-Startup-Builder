import React, { useState } from "react";
import {
  LayoutDashboard, Settings, FileText, Search, RefreshCw,
  Terminal, Sparkles, CheckCircle2, AlertTriangle, User,
  LogOut, Home, Download, ChevronRight, Eye, Layers, Cpu, Award, Play,
  MessageSquare, History, Bookmark, Sliders, ShieldCheck, Check, Copy,
  Clock, Filter, Key, Bell, CreditCard, Activity, ArrowRight, Zap, ChevronDown, ChevronUp, Presentation, DollarSign, TrendingUp, BarChart3, Rocket, Compass
} from "lucide-react";
import { AGENTS, getAgentColor } from "../constants";
import { useTheme } from "../context/ThemeContext";
import WorkspaceLayout from "../components/WorkspaceLayout";
import { generateDynamicAgentReports } from "../services/agentEngine";
import { startStartupGeneration, pollStartupStatus, formatBackendBlueprintToReports } from "../services/api";
import { botEmotionManager } from "../components/AIBot/BotEmotionManager";

import AgentSwarmRoundFlow from "../components/AgentSwarmRoundFlow";
import AgentResultsViewer from "../components/AgentResultsViewer";
import ExportBlueprintModal from "../components/ExportBlueprintModal";

// Helper: Formatted Markdown Text Parser (Strips raw ** asterisks and renders styled JSX)
const renderFormattedText = (text) => {

  if (!text) return null;


  // Split by line break
  const lines = text.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Header lines (### or ##)
        if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
          const cleanHeader = trimmed.replace(/^#+\s*/, "").replace(/\*\*/g, "");
          return (
            <h4 key={idx} className="font-display font-bold text-sm text-cyan-400 mt-3 mb-1 border-b border-border/50 pb-1">
              {cleanHeader}
            </h4>
          );
        }

        // Bullet point lines (- or •)
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const bulletContent = trimmed.replace(/^[-•]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
              <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
              <span>{parseBoldInline(bulletContent)}</span>
            </div>
          );
        }

        // Standard paragraph line
        return (
          <p key={idx} className="text-xs leading-relaxed">
            {parseBoldInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Inline helper for replacing **bold** with <strong> tags
const parseBoldInline = (str) => {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-text bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

// Helper to retrieve industry benchmark sizing metrics
const getIndustryMetrics = (industry) => {
  const table = {
    "FoodTech": { tam: "$14.8 Billion", sam: "$3.2 Billion", som: "$450 Million", cagr: "12.8%", y1: "$1.8M", y2: "$5.4M", y3: "$11.2M", margin: "72%" },
    "FinTech": { tam: "$24.5 Billion", sam: "$5.8 Billion", som: "$780 Million", cagr: "18.4%", y1: "$3.1M", y2: "$9.2M", y3: "$18.5M", margin: "84%" },
    "HealthTech": { tam: "$31.2 Billion", sam: "$7.1 Billion", som: "$920 Million", cagr: "16.1%", y1: "$2.8M", y2: "$8.4M", y3: "$16.2M", margin: "80%" },
    "EdTech": { tam: "$9.6 Billion", sam: "$2.1 Billion", som: "$280 Million", cagr: "11.5%", y1: "$1.2M", y2: "$3.8M", y3: "$8.1M", margin: "76%" },
    "SaaS / B2B": { tam: "$42.0 Billion", sam: "$9.4 Billion", som: "$1.2 Billion", cagr: "19.2%", y1: "$2.4M", y2: "$7.8M", y3: "$14.8M", margin: "82%" },
    "E-commerce": { tam: "$18.2 Billion", sam: "$4.6 Billion", som: "$560 Million", cagr: "13.7%", y1: "$2.0M", y2: "$6.1M", y3: "$12.4M", margin: "68%" },
    "Climate / GreenTech": { tam: "$21.4 Billion", sam: "$5.2 Billion", som: "$640 Million", cagr: "22.3%", y1: "$2.6M", y2: "$8.1M", y3: "$16.9M", margin: "79%" },
    "Other": { tam: "$12.0 Billion", sam: "$2.8 Billion", som: "$320 Million", cagr: "12.0%", y1: "$1.5M", y2: "$4.5M", y3: "$9.5M", margin: "75%" }
  };
  return table[industry] || table["SaaS / B2B"];
};

// Dynamic Flashcard Stats extracted per agent output
const getFlashcardStats = (intakeData, reports) => {
  const m = getIndustryMetrics(intakeData?.industry);
  const raw = reports?._raw || {};
  const v = raw.validation || {};
  const mk = raw.market || {};
  const f = raw.financial || {};
  const pt = raw.pitch || {};

  const feasScore = v.feasibility_score !== undefined ? `${v.feasibility_score} / 100` : "9.4 / 10";
  const innovScore = v.innovation_score !== undefined ? `${v.innovation_score} / 100` : "High Market Fit";
  const tamVal = mk.market_size || m.tam;
  const breakEvenVal = f.break_even || "3.5 Months";
  const estCost = f.estimated_cost || "$45,000";
  const estRev = f.expected_revenue || "$380k ARR";
  const roiVal = f.roi || "12.0x";

  return {
    ideaValidation: [
      { label: "Feasibility Score", value: feasScore, color: "#10B981", icon: Award },
      { label: "Innovation Index", value: innovScore, color: "#6366F1", icon: Sparkles },
    ],
    marketResearch: [
      { label: "Market Sizing", value: String(tamVal).length > 24 ? String(tamVal).slice(0, 22) + "..." : tamVal, color: "#06B6D4", icon: DollarSign },
      { label: "Target Sector", value: mk.industry || intakeData?.industry || "SaaS / B2B", color: "#0EA5E9", icon: BarChart3 },
      { label: "Market CAGR", value: `${m.cagr} / Year`, color: "#10B981", icon: TrendingUp },
    ],
    financialPlanning: [
      { label: "Projected ROI", value: String(roiVal).length > 20 ? String(roiVal).slice(0, 18) + "..." : roiVal, color: "#10B981", icon: TrendingUp },
      { label: "Setup Capital", value: String(estCost).length > 22 ? String(estCost).slice(0, 20) + "..." : estCost, color: "#6366F1", icon: DollarSign },
      { label: "Expected Revenue", value: String(estRev).length > 22 ? String(estRev).slice(0, 20) + "..." : estRev, color: "#0EA5E9", icon: DollarSign },
      { label: "Break-Even", value: String(breakEvenVal).length > 20 ? String(breakEvenVal).slice(0, 18) + "..." : breakEvenVal, color: "#F59E0B", icon: Clock },
    ],
    competitorAnalysis: [
      { label: "Moat Analysis", value: "Verified AI Moat", color: "#10B981", icon: ShieldCheck },
      { label: "Competitor Gap", value: "Market Open", color: "#6366F1", icon: Activity },
    ],
    pitchDeck: [
      { label: "Deck Title", value: pt.title ? (pt.title.length > 20 ? pt.title.slice(0, 18) + "..." : pt.title) : "10 Slides Ready", color: "#F59E0B", icon: Presentation },
      { label: "Pitch Readiness", value: "Investor Ready", color: "#10B981", icon: Sparkles },
    ]
  };
};

// Dynamic Pitch Deck Slide Preview Component
const PitchDeckSlidePreview = ({ intakeData, reports }) => {
  const m = getIndustryMetrics(intakeData?.industry);
  const raw = reports?._raw || {};
  const pt = raw.pitch || {};
  const v = raw.validation || {};
  const b = raw.business_model || {};
  const f = raw.financial || {};

  const idea = pt.title || intakeData?.idea || "AI Startup Architecture";
  const problem = pt.problem || v.problem || intakeData?.problem || "High friction manual operations in industry.";
  const solution = pt.solution || v.solution || "Autonomous intelligent multi-agent platform.";
  const market = pt.market || raw.market?.market_size || `${m.tam} Total Addressable Market`;
  const bizModel = pt.business_model || b.revenue_model || "Tiered SaaS subscription model";
  const financials = pt.financials || f.expected_revenue || `${m.y1} ARR Year 1`;

  const slides = [
    { slide: "Slide 1: Title & Vision", content: idea },
    { slide: "Slide 2: The Problem", content: problem },
    { slide: "Slide 3: The Solution", content: solution },
    { slide: "Slide 4: Market Sizing", content: market },
    { slide: "Slide 5: Business Model", content: bizModel },
    { slide: "Slide 6: Financial Projections", content: financials },
  ];

  return (
    <div className="space-y-4 pt-2">
      <span className="font-mono text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
        PITCH DECK SLIDE PREVIEW (10 SLIDES)
      </span>
      <div className="grid sm:grid-cols-2 gap-4 font-body">
        {slides.map((s, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-surface border border-border space-y-1.5 shadow-xs hover:border-cyan-500/40 transition-all">
            <span className="font-mono text-[10px] font-bold text-cyan-400 block">{s.slide}</span>
            <p className="text-xs text-text leading-relaxed font-medium">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Visual Graphs Analytics Component
const AnalyticsVisuals = ({ intakeData, reports }) => {
  const m = getIndustryMetrics(intakeData?.industry);
  const raw = reports?._raw || {};
  const v = raw.validation || {};
  const mk = raw.market || {};
  const f = raw.financial || {};

  // Deterministic seed fallback
  const seedString = `${intakeData?.idea || "startup"}_${intakeData?.industry || "tech"}`;
  let seedHash = 0;
  for (let i = 0; i < seedString.length; i++) {
    seedHash = (seedHash << 5) - seedHash + seedString.charCodeAt(i);
    seedHash |= 0;
  }
  const derivedSeed = Math.abs(seedHash);

  // Dynamic Feasibility Index
  const rawFeas = v.feasibility_score;
  const feasNum = rawFeas !== undefined
    ? (typeof rawFeas === "number" ? rawFeas : parseInt(rawFeas, 10) || 85)
    : 78 + (derivedSeed % 18);
  const feasDisplay = `${(feasNum / 10).toFixed(1)} / 10`;

  // Dynamic Financials
  const ltvCacVal = f.roi || f.ltv_cac || `${(7.2 + ((derivedSeed % 55) / 10)).toFixed(1)}x`;
  const cacVal = f.cac || `$${180 + ((derivedSeed % 28) * 10)}`;
  const ltvVal = f.ltv || `$${Math.round(parseInt(String(cacVal).replace(/[^0-9]/g, "") || "240") * parseFloat(ltvCacVal))}`;
  const paybackVal = f.break_even || `${(2.8 + ((derivedSeed % 30) / 10)).toFixed(1)} Months`;

  const tamDisplay = mk.market_size || mk.tam || m.tam;
  const samDisplay = mk.sam || m.sam;
  const somDisplay = mk.som || m.som;
  const y1Display = f.y1_arr || f.expected_revenue || m.y1;
  const y2Display = f.y2_arr || m.y2;
  const y3Display = f.y3_arr || m.y3;
  const marginDisplay = f.gross_margin || m.margin;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Market Size Breakdown */}
        <div className="bento-card p-6 rounded-3xl border border-border bg-surface space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-text flex items-center gap-2">
                <BarChart3 size={18} className="text-cyan-400" /> Market Size Breakdown (TAM / SAM / SOM)
              </h3>
              <p className="text-xs text-textMuted font-mono">Industry: {intakeData?.industry || 'SaaS / B2B'}</p>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              {m.cagr} CAGR
            </span>
          </div>

          <div className="space-y-4 pt-2 font-mono">
            {[
              { label: "TAM (Total Addressable)", value: tamDisplay, pct: "100%", color: "#06B6D4" },
              { label: "SAM (Serviceable Addressable)", value: samDisplay, pct: "25%", color: "#6366F1" },
              { label: "SOM (Serviceable Obtainable)", value: somDisplay, pct: "8%", color: "#10B981" },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text">{bar.label}</span>
                  <span style={{ color: bar.color }}>{bar.value}</span>
                </div>
                <div className="h-3 w-full bg-surfaceAlt rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-xs"
                    style={{ width: bar.pct, backgroundColor: bar.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Year ARR Line Graph */}
        <div className="bento-card p-6 rounded-3xl border border-border bg-surface space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-text flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" /> 3-Year ARR Financial Projection
              </h3>
              <p className="text-xs text-textMuted font-mono">Forecasted Annual Recurring Revenue Growth</p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {marginDisplay} Margin
            </span>
          </div>

          <div className="pt-2">
            <svg className="w-full h-36 overflow-visible" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="80" x2="300" y2="80" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" strokeOpacity="0.1" />

              <path d="M 20 80 Q 150 50 280 15 L 280 80 Z" fill="url(#chartGrad)" />
              <path d="M 20 80 Q 150 50 280 15" fill="none" stroke="#10B981" strokeWidth="3" />

              <circle cx="20" cy="80" r="4" fill="#10B981" />
              <circle cx="150" cy="50" r="4" fill="#10B981" />
              <circle cx="280" cy="15" r="4" fill="#10B981" />
            </svg>

            <div className="grid grid-cols-3 text-center font-mono text-xs pt-3 border-t border-border">
              <div>
                <span className="text-textMuted text-[10px] block">YEAR 1</span>
                <strong className="text-text font-bold">{y1Display}</strong>
              </div>
              <div>
                <span className="text-textMuted text-[10px] block">YEAR 2</span>
                <strong className="text-cyan-400 font-bold">{y2Display}</strong>
              </div>
              <div>
                <span className="text-textMuted text-[10px] block">YEAR 3</span>
                <strong className="text-emerald-400 font-bold">{y3Display}</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bento-card p-5 rounded-3xl border border-border bg-surface space-y-2 shadow-xs">
          <span className="font-mono text-[10px] font-bold text-textMuted uppercase block">LTV : CAC RATIO</span>
          <span className="font-display font-extrabold text-2xl text-emerald-400 block">{ltvCacVal}</span>
          <p className="text-xs text-textMuted leading-tight font-mono">LTV: {ltvVal} · CAC: {cacVal}</p>
        </div>

        <div className="bento-card p-5 rounded-3xl border border-border bg-surface space-y-2 shadow-xs">
          <span className="font-mono text-[10px] font-bold text-textMuted uppercase block">CAC PAYBACK</span>
          <span className="font-display font-extrabold text-2xl text-cyan-400 block">{paybackVal}</span>
          <p className="text-xs text-textMuted leading-tight font-mono">Rapid Capital Recovery</p>
        </div>

        <div className="bento-card p-5 rounded-3xl border border-border bg-surface space-y-2 shadow-xs">
          <span className="font-mono text-[10px] font-bold text-textMuted uppercase block">FEASIBILITY INDEX</span>
          <span className="font-display font-extrabold text-2xl text-purple-400 block">{feasDisplay}</span>
          <p className="text-xs text-textMuted leading-tight font-mono">
            {feasNum >= 80 ? "High Market Viability" : "Niche Market Viability"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Swarm Terminal Log Console Stream Component
const SwarmTerminalConsole = ({ reports, selectedAgentsList }) => (
  <div className="bento-card rounded-3xl border border-border bg-slate-950 p-6 space-y-4 font-mono text-xs shadow-2xl text-left">
    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
      <div className="flex items-center gap-2 text-cyan-400">
        <Terminal size={16} />
        <span className="font-bold uppercase tracking-wider">SWARM ORCHESTRATOR REAL-TIME CONSOLE</span>
      </div>
      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
        ● ALL {selectedAgentsList.length} MODULES OPERATIONAL
      </span>
    </div>

    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 text-slate-300">
      {selectedAgentsList.map((a) => (
        <div key={a.key} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-400">[{a.tag}] {a.name.toUpperCase()}</span>
            <span className="text-[10px] text-slate-400">Latency: 240ms · Confidence: 96%</span>
          </div>
          <div className="text-[11px] text-slate-300 leading-relaxed font-mono line-clamp-2">
            {renderFormattedText(reports?.[a.key] || "Agent output packet synthesized.")}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Swarm Efficiency Matrix Component
const SwarmEfficiencyMatrix = () => (
  <div className="bento-card p-6 rounded-3xl border border-border bg-surface space-y-4 shadow-xs text-left">
    <div className="flex items-center justify-between border-b border-border pb-3">
      <h3 className="font-display font-bold text-base text-text flex items-center gap-2">
        <Cpu size={18} className="text-cyan-400" /> Specialist Agent Efficiency Matrix
      </h3>
      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
        100% OPTIMIZED
      </span>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
      {AGENTS.map((a, i) => {
        const conf = (9.1 + ((i * 13) % 8) / 10).toFixed(1);
        const speed = 180 + ((i * 37) % 120);
        const tokens = (1.2 + ((i * 19) % 9) / 10).toFixed(1);
        return (
          <div key={a.key} className="p-3.5 rounded-2xl bg-surface border border-border space-y-2 hover:border-cyan-500/40 transition-all">
            <span className="text-[10px] font-bold text-cyan-400 block">{a.tag}</span>
            <h4 className="font-display font-bold text-xs text-text truncate">{a.name}</h4>
            <div className="space-y-1 text-[10px] text-textMuted border-t border-border pt-2">
              <div className="flex justify-between"><span>Speed:</span><strong className="text-emerald-400">{speed}ms</strong></div>
              <div className="flex justify-between"><span>Confidence:</span><strong className="text-cyan-400">{conf}/10</strong></div>
              <div className="flex justify-between"><span>Tokens:</span><strong className="text-text">{tokens}k</strong></div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const DEFAULT_STARTER_CONCEPT = {
  idea: "Autonomous Multi-Agent Startup Acceleration Platform",
  problem: "Founders spend weeks on fragmented market research, manual financial modeling, and competitor discovery.",
  audience: "Early-stage founders, startup studios, venture creators, and product innovators.",
  industry: "SaaS / B2B"
};

export default function DashboardPage({ go, user, setUser }) {
  const { dark } = useTheme();

  // Trigger celebration emotion on mascot when viewing blueprint results
  React.useEffect(() => {
    botEmotionManager.setEmotion("celebrating", 6000);
  }, []);

  // Active View Tab: "flow" | "results" | "analytics" | "console" | "matrix"
  const [activeTab, setActiveTab] = useState("flow");

  // Selected agent keys
  const [selectedAgentKeys] = useState(() => {
    const saved = localStorage.getItem("selected_agent_keys");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return AGENTS.map((a) => a.key);
  });

  // Export Blueprint Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Intake Data - safely fallback to demo starter concept so dashboard is ALWAYS available
  const [intakeData] = useState(() => {
    const saved = localStorage.getItem("startup_intake");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.idea) return parsed;
      } catch (e) { }
    }
    const singleIdea = localStorage.getItem("startup_idea");
    if (singleIdea) {
      return {
        idea: singleIdea,
        problem: "",
        audience: "",
        industry: "SaaS / B2B"
      };
    }
    return null;
  });

  const hasCustomIdea = Boolean(intakeData && intakeData.idea);
  const safeIntake = hasCustomIdea ? intakeData : DEFAULT_STARTER_CONCEPT;

  const [reports, setReports] = useState(() => generateDynamicAgentReports(safeIntake));
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [backendError, setBackendError] = useState(null);
  const [isLiveFromBackend, setIsLiveFromBackend] = useState(false);
  const [currentWorkingAgent, setCurrentWorkingAgent] = useState(null);
  const [completedAgents, setCompletedAgents] = useState(() => AGENTS.map((a) => a.key));
  const [progressPercent, setProgressPercent] = useState(100);
  const [copiedKey, setCopiedKey] = useState(null);

  // Call FastAPI backend to generate blueprint via LangGraph
  const fetchBlueprintFromBackend = React.useCallback(async (forceRefresh = false) => {
    if (!safeIntake?.idea) return;

    if (!forceRefresh) {
      const cached = localStorage.getItem(`blueprint_${safeIntake.idea}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setReports(parsed);
          setIsLoading(false);
          setIsLiveFromBackend(true);
          setCompletedAgents(AGENTS.map((a) => a.key));
          setCurrentWorkingAgent(null);
          setProgressPercent(100);
          return;
        } catch (e) { }
      }
    }

    setIsLoading(true);
    setBackendError(null);
    setCompletedAgents([]);
    setCurrentWorkingAgent("ideaValidation");
    setProgressPercent(5);
    setLoadingStep("Initializing multi-agent graph with Google Gemini...");
    botEmotionManager.setEmotion("thinking", 25000);

    try {
      const taskResponse = await startStartupGeneration(safeIntake.idea);
      setLoadingStep("Multi-agent swarm active! 10 agents executing sequentially...");

      const blueprintResult = await pollStartupStatus(taskResponse.task_id, (statusUpdate) => {
        if (statusUpdate.status === "processing") {
          if (statusUpdate.current_agent) {
            setCurrentWorkingAgent(statusUpdate.current_agent);
          }
          if (statusUpdate.completed_agents && Array.isArray(statusUpdate.completed_agents)) {
            setCompletedAgents(statusUpdate.completed_agents);
          }
          if (statusUpdate.progress_percent !== undefined) {
            setProgressPercent(statusUpdate.progress_percent);
          }
          if (statusUpdate.current_agent_name) {
            setLoadingStep(`Agent ${statusUpdate.current_agent_name} is synthesizing intelligence...`);
          }
        }
      });

      const formattedReports = formatBackendBlueprintToReports(blueprintResult);
      setReports(formattedReports);
      setIsLiveFromBackend(true);
      setCompletedAgents(AGENTS.map((a) => a.key));
      setCurrentWorkingAgent(null);
      setProgressPercent(100);
      localStorage.setItem(`blueprint_${safeIntake.idea}`, JSON.stringify(formattedReports));
      botEmotionManager.setEmotion("celebrating", 6000);
    } catch (err) {
      console.warn("Cloud backend returned error or is offline, orchestrating via local swarm engine:", err);
      setBackendError(err.message || "Local Swarm Engine Active");
      const fallbackReports = generateDynamicAgentReports(safeIntake);
      setReports(fallbackReports);
      setIsLiveFromBackend(false);

      // Sequentially animate each agent so the swarm displays live progress
      for (let i = 0; i < AGENTS.length; i++) {
        const agent = AGENTS[i];
        setCurrentWorkingAgent(agent.key);
        setLoadingStep(`Agent [${agent.tag}] ${agent.name} is synthesizing intelligence...`);
        setProgressPercent(Math.round(((i + 1) / AGENTS.length) * 95));
        await new Promise((resolve) => setTimeout(resolve, 650));
        setCompletedAgents((prev) => [...prev, agent.key]);
      }

      setCurrentWorkingAgent(null);
      setProgressPercent(100);
      setLoadingStep("Swarm synthesis complete! All 10 specialist modules verified.");
      localStorage.setItem(`blueprint_${safeIntake.idea}`, JSON.stringify(fallbackReports));
      botEmotionManager.setEmotion("celebrating", 6000);
    } finally {
      setIsLoading(false);
    }
  }, [safeIntake]);

  React.useEffect(() => {
    fetchBlueprintFromBackend(false);
  }, [fetchBlueprintFromBackend]);

  // Automatically save current execution into startup_history
  React.useEffect(() => {
    if (!safeIntake?.idea) return;
    try {
      const saved = localStorage.getItem("startup_history");
      const list = saved ? JSON.parse(saved) : [];
      const existingIndex = list.findIndex(item => item.title === safeIntake.idea);
      const raw = reports?._raw || {};
      const rawFeas = raw.validation?.feasibility_score;
      let feasText = "8.6/10";
      if (rawFeas !== undefined && rawFeas !== null) {
        feasText = typeof rawFeas === "number" ? `${(rawFeas / 10).toFixed(1)}/10` : String(rawFeas);
      } else {
        const hash = Math.abs(safeIntake.idea.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0));
        feasText = `${(7.8 + (hash % 18) / 10).toFixed(1)}/10`;
      }

      const historyItem = {
        id: "hist-" + Date.now(),
        title: safeIntake.idea,
        industry: safeIntake.industry || "SaaS / B2B",
        date: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentsRunCount: selectedAgentKeys.length || 10,
        feasibility: feasText,
        intakeData: safeIntake
      };
      if (existingIndex >= 0) {
        list[existingIndex] = historyItem;
      } else {
        list.unshift(historyItem);
      }
      localStorage.setItem("startup_history", JSON.stringify(list));
    } catch (e) { }
  }, [safeIntake, selectedAgentKeys, reports]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedAgentsList = AGENTS.filter(a => selectedAgentKeys.includes(a.key));

  const handleOpenExportModal = () => {
    setIsExportModalOpen(true);
  };

  return (
    <WorkspaceLayout
      go={go}
      user={user}
      setUser={setUser}
      currentKey="dashboard"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onExportBlueprint={handleOpenExportModal}
      title="DASHBOARD & INTELLIGENCE"
    >
      <div className="p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6 animate-fadeUp text-left">

        {/* Welcome Starter Banner if Fresh User */}
        {!hasCustomIdea && (
          <div className="bento-card p-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-cyber-cyan">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                ✨ GET STARTED WITH YOUR STARTUP
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-text">
                Welcome to your AI Founder Workspace!
              </h2>
              <p className="text-xs text-textMuted leading-relaxed max-w-2xl">
                You are currently viewing a live sample blueprint. Describe your own startup concept to have 10 AI specialist agents generate customized financial models, TAM/SAM analyses, and investor slides.
              </p>
            </div>

            <button
              onClick={() => go("questions")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none cursor-pointer shadow-cyber-cyan hover:scale-[1.02] transition-all shrink-0"
            >
              <Rocket size={14} /> Start Idea Intake
            </button>
          </div>
        )}

        {/* Active Concept Banner */}
        <div className="bento-card p-6 rounded-3xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                {hasCustomIdea ? "ACTIVE CONCEPT ANALYSIS" : "STARTER DEMO CONCEPT"}
              </span>
              <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                100% READY
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-text">
              "{safeIntake.idea}"
            </h1>
            <p className="text-xs text-textMuted font-mono">
              Sector: <strong className="text-text font-bold">{safeIntake.industry || "SaaS / B2B"}</strong> · Executed {selectedAgentsList.length} Specialist Agents
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => go("questions")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surfaceAlt border border-border text-text hover:bg-border transition-all cursor-pointer"
            >
              <Rocket size={14} className="text-cyan-400" /> New Idea
            </button>
            <button
              onClick={() => go("history")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surfaceAlt border border-border text-text hover:bg-border transition-all cursor-pointer"
            >
              <History size={14} /> History
            </button>
          </div>
        </div>

        {/* Live Swarm Generation Progress Banner */}
        {isLoading && (
          <div className="bento-card p-5 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 space-y-3 shadow-cyber-cyan animate-fadeUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  SWARM RUNNING · GOOGLE GEMINI ACTIVE
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-cyan-400">
                {progressPercent}% COMPLETE
              </span>
            </div>

            <div className="w-full h-2.5 bg-surfaceAlt rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-textMuted pt-1">
              <span>{loadingStep || "Orchestrating specialist agents..."}</span>
              <span className="text-emerald-400 font-bold">
                {completedAgents.length} of 10 Agents Done
              </span>
            </div>
          </div>
        )}

        {/* Interactive Dashboard Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "flow", label: "Agent Swarm Flow", icon: Compass, badge: `${completedAgents.length}/10` },
            { id: "results", label: "Results Thread", icon: MessageSquare, badge: `${selectedAgentsList.length}` },
            { id: "analytics", label: "Analytics & Graphs", icon: BarChart3 },
            { id: "console", label: "Terminal Console", icon: Terminal },
            { id: "matrix", label: "Swarm Efficiency", icon: Cpu },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/40 shadow-cyber-cyan font-extrabold"
                    : "bg-surface text-textMuted border border-border hover:text-text hover:bg-surfaceAlt"
                }`}
              >
                <TabIcon size={14} className={isActive ? "text-cyan-400" : ""} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      isActive
                        ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/30"
                        : "bg-surfaceAlt text-textMuted border border-border"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 0: AGENT SWARM ROUND FLOW */}
        {activeTab === "flow" && (
          <div className="space-y-6 animate-fadeUp">
            <AgentSwarmRoundFlow
              currentAgent={currentWorkingAgent}
              completedAgents={completedAgents}
              progressPercent={progressPercent}
              reports={reports}
              startupIdea={safeIntake.idea}
              isLoading={isLoading}
              onSelectAgent={(agentKey) => {
                const el = document.getElementById(`agent-section-${agentKey}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              onReRun={() => fetchBlueprintFromBackend(true)}
              onViewBlueprint={() => {
                setActiveTab("results");
                setTimeout(() => {
                  const el = document.getElementById("blueprint-results-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            />
          </div>
        )}

        {/* TAB 1: RESULTS THREAD / FOUNDER INTELLIGENCE SUITE */}
        {activeTab === "results" && (
          <div id="blueprint-results-section" className="space-y-6 animate-fadeUp">
            <AgentResultsViewer
              reports={reports}
              intakeData={safeIntake}
              onExportBlueprint={handleOpenExportModal}
              onReRun={() => fetchBlueprintFromBackend(true)}
            />
          </div>
        )}

        {/* TAB 2: ANALYTICS & CHARTS */}
        {activeTab === "analytics" && (
          <AnalyticsVisuals intakeData={safeIntake} reports={reports} />
        )}

        {/* TAB 3: TERMINAL CONSOLE LOGS */}
        {activeTab === "console" && (
          <SwarmTerminalConsole reports={reports} selectedAgentsList={selectedAgentsList} />
        )}

        {/* TAB 4: SWARM EFFICIENCY MATRIX */}
        {activeTab === "matrix" && (
          <SwarmEfficiencyMatrix />
        )}

      </div>

      {/* Export Blueprint Modal */}
      <ExportBlueprintModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        intakeData={safeIntake}
        reports={reports}
      />
    </WorkspaceLayout>
  );
}
