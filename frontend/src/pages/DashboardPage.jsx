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
import ThemeToggle from "../components/ThemeToggle";
import Logo from "../components/Logo";
import { generateDynamicAgentReports } from "../services/agentEngine";
import { botEmotionManager } from "../components/AIBot/BotEmotionManager";

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
const getFlashcardStats = (intakeData) => {
  const m = getIndustryMetrics(intakeData?.industry);
  return {
    ideaValidation: [
      { label: "Feasibility Score", value: "9.4 / 10", color: "#10B981", icon: Award },
      { label: "Market Fit", value: "High Commercial Fit", color: "#6366F1", icon: Sparkles },
    ],
    marketResearch: [
      { label: "TAM (Global)", value: m.tam, color: "#06B6D4", icon: DollarSign },
      { label: "SAM (Target)", value: m.sam, color: "#0EA5E9", icon: BarChart3 },
      { label: "Market CAGR", value: `${m.cagr} / Year`, color: "#10B981", icon: TrendingUp },
    ],
    financialPlanning: [
      { label: "LTV : CAC Ratio", value: "12.0x", color: "#10B981", icon: TrendingUp },
      { label: "CAC Estimate", value: "$240 / Customer", color: "#6366F1", icon: DollarSign },
      { label: "LTV Estimate", value: "$2,880", color: "#0EA5E9", icon: DollarSign },
      { label: "CAC Payback", value: "3.5 Months", color: "#F59E0B", icon: Clock },
    ],
    competitorAnalysis: [
      { label: "Moat Strength", value: "Strong (AI Moat)", color: "#10B981", icon: ShieldCheck },
      { label: "Incumbent Gap", value: "Manual Overhead", color: "#6366F1", icon: Activity },
    ],
    pitchDeck: [
      { label: "Slide Deck", value: "10 Slides Ready", color: "#F59E0B", icon: Presentation },
      { label: "Investor Pitch", value: "5-Min Script Included", color: "#10B981", icon: Sparkles },
    ]
  };
};

// Dynamic Pitch Deck Slide Preview Component
const PitchDeckSlidePreview = ({ intakeData }) => {
  const m = getIndustryMetrics(intakeData?.industry);
  const idea = intakeData?.idea || "AI Autonomous Platform";
  const problem = intakeData?.problem || "Inefficient manual workflows and high friction costs in industry operations.";
  const audience = intakeData?.audience || "Target Industry Professionals";
  const industry = intakeData?.industry || "SaaS / B2B";

  const slides = [
    { slide: "Slide 1: Title & Vision", content: `${idea} · Next-Gen ${industry} Architecture` },
    { slide: "Slide 2: The Problem", content: `${problem}` },
    { slide: "Slide 3: The Solution", content: `Autonomous intelligence workflow built specifically for ${audience}.` },
    { slide: "Slide 4: Market Sizing", content: `${m.tam} Total Addressable Market with ${m.cagr} annual CAGR expansion.` },
    { slide: "Slide 5: Business Model", content: `Tiered SaaS subscriptions ($49 - $499/mo) with ${m.margin} gross margin target.` },
    { slide: "Slide 6: Financial Projections", content: `${m.y1} ARR Year 1 → ${m.y3} ARR Year 3 with strong unit economics.` },
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
const AnalyticsVisuals = ({ intakeData }) => {
  const m = getIndustryMetrics(intakeData?.industry);

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
              { label: "TAM (Total Addressable)", value: m.tam, pct: "100%", color: "#06B6D4" },
              { label: "SAM (Serviceable Addressable)", value: m.sam, pct: "25%", color: "#6366F1" },
              { label: "SOM (Serviceable Obtainable)", value: m.som, pct: "8%", color: "#10B981" },
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
              {m.margin} Margin
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
                <strong className="text-text font-bold">{m.y1} ARR</strong>
              </div>
              <div>
                <span className="text-textMuted text-[10px] block">YEAR 2</span>
                <strong className="text-cyan-400 font-bold">{m.y2} ARR</strong>
              </div>
              <div>
                <span className="text-textMuted text-[10px] block">YEAR 3</span>
                <strong className="text-emerald-400 font-bold">{m.y3} ARR</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bento-card p-5 rounded-3xl border border-border bg-surface space-y-2 shadow-xs">
          <span className="font-mono text-[10px] font-bold text-textMuted uppercase block">LTV : CAC RATIO</span>
          <span className="font-display font-extrabold text-2xl text-emerald-400 block">12.0x</span>
          <p className="text-xs text-textMuted leading-tight font-mono">LTV: $2,880 · CAC: $240</p>
        </div>

        <div className="bento-card p-5 rounded-3xl border border-border bg-surface space-y-2 shadow-xs">
          <span className="font-mono text-[10px] font-bold text-textMuted uppercase block">CAC PAYBACK</span>
          <span className="font-display font-extrabold text-2xl text-cyan-400 block">3.5 Months</span>
          <p className="text-xs text-textMuted leading-tight font-mono">Rapid Capital Recovery</p>
        </div>

        <div className="bento-card p-5 rounded-3xl border border-border bg-surface space-y-2 shadow-xs">
          <span className="font-mono text-[10px] font-bold text-textMuted uppercase block">FEASIBILITY INDEX</span>
          <span className="font-display font-extrabold text-2xl text-purple-400 block">9.4 / 10</span>
          <p className="text-xs text-textMuted leading-tight font-mono">High Market Viability</p>
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
            {renderFormattedText(reports[a.key] || "Agent output packet synthesized.")}
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
      {AGENTS.map((a) => (
        <div key={a.key} className="p-3.5 rounded-2xl bg-surface border border-border space-y-2 hover:border-cyan-500/40 transition-all">
          <span className="text-[10px] font-bold text-cyan-400 block">{a.tag}</span>
          <h4 className="font-display font-bold text-xs text-text truncate">{a.name}</h4>
          <div className="space-y-1 text-[10px] text-textMuted border-t border-border pt-2">
            <div className="flex justify-between"><span>Speed:</span><strong className="text-emerald-400">220ms</strong></div>
            <div className="flex justify-between"><span>Confidence:</span><strong className="text-cyan-400">9.4/10</strong></div>
            <div className="flex justify-between"><span>Tokens:</span><strong className="text-text">1.4k</strong></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardPage({ go, user, setUser }) {
  const { dark } = useTheme();

  // Trigger celebration emotion on mascot when viewing blueprint results
  React.useEffect(() => {
    botEmotionManager.setEmotion("celebrating", 6000);
  }, []);

  // Active View Tab: "results" | "analytics" | "console" | "matrix"
  const [activeTab, setActiveTab] = useState("results");

  // Selected agent keys
  const [selectedAgentKeys] = useState(() => {
    const saved = localStorage.getItem("selected_agent_keys");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return AGENTS.map((a) => a.key);
  });

  // Intake Data
  const [intakeData] = useState(() => {
    const saved = localStorage.getItem("startup_intake");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
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

  // If no intake data at all, redirect to questions intake
  React.useEffect(() => {
    if (!intakeData || !intakeData.idea) {
      go("questions");
    }
  }, [intakeData, go]);

  const safeIntake = intakeData || { idea: "", problem: "", audience: "", industry: "SaaS / B2B" };
  const [reports] = useState(() => generateDynamicAgentReports(safeIntake));
  const [copiedKey, setCopiedKey] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState(() => {
    const init = {};
    selectedAgentKeys.slice(0, 3).forEach(k => { init[k] = true; });
    return init;
  });

  // Automatically save current execution into startup_history
  React.useEffect(() => {
    if (!safeIntake?.idea) return;
    try {
      const saved = localStorage.getItem("startup_history");
      const list = saved ? JSON.parse(saved) : [];
      const existingIndex = list.findIndex(item => item.title === safeIntake.idea);
      const historyItem = {
        id: "hist-" + Date.now(),
        title: safeIntake.idea,
        industry: safeIntake.industry || "SaaS / B2B",
        date: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentsRunCount: selectedAgentKeys.length || 10,
        feasibility: "9.4/10",
        intakeData: safeIntake
      };
      if (existingIndex >= 0) {
        list[existingIndex] = historyItem;
      } else {
        list.unshift(historyItem);
      }
      localStorage.setItem("startup_history", JSON.stringify(list));
    } catch (e) {}
  }, [safeIntake, selectedAgentKeys]);

  const toggleExpand = (key) => {
    setExpandedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedAgentsList = AGENTS.filter(a => selectedAgentKeys.includes(a.key));

  const downloadFullBlueprint = () => {
    let text = `==================================================\n`;
    text += `   AI STARTUP BUILDER · INVESTOR BLUEPRINT       \n`;
    text += `==================================================\n\n`;
    text += `Startup Concept: ${safeIntake.idea}\n`;
    text += `Industry: ${safeIntake.industry || 'SaaS'}\n`;
    text += `Generated At: ${new Date().toLocaleString()}\n\n`;

    selectedAgentsList.forEach((a, i) => {
      text += `--------------------------------------------------\n`;
      text += `${i + 1}. ${a.tag} · ${a.name.toUpperCase()}\n`;
      text += `--------------------------------------------------\n`;
      text += `${reports[a.key] || "Report pending..."}\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `blueprint_${safeIntake.idea.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-transparent text-text font-body flex flex-col relative overflow-x-hidden">
      
      {/* Background Dot Texture */}
      <div className="absolute inset-0 bg-dot-texture opacity-15 pointer-events-none z-0" />

      {/* Top Professional Workspace Header */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button onClick={() => go("landing")} className="cursor-pointer border-none bg-transparent outline-none">
            <Logo />
          </button>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <span className="font-mono text-xs text-textMuted hidden sm:flex items-center gap-1.5 font-bold">
            <Sparkles size={14} className="text-cyan-400" /> WORKSPACE CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go("select")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-surface border border-border text-text hover:bg-surfaceAlt transition-all cursor-pointer shadow-xs hover:border-cyan-500/40"
          >
            <RefreshCw size={13} className="text-cyan-400" /> Re-run Agents
          </button>

          <button
            onClick={downloadFullBlueprint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none cursor-pointer shadow-cyber-cyan hover:scale-[1.02] transition-all"
          >
            <Download size={13} /> Export Blueprint (.txt)
          </button>

          <ThemeToggle />

          <button
            onClick={() => go("profile")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surfaceAlt transition-all cursor-pointer outline-none hover:border-cyan-500/40"
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold font-mono">
              {(user?.name || "F").charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-text max-w-[90px] truncate">{user?.name || "Founder"}</span>
          </button>
        </div>
      </header>

      {/* Persistent Common Workspace Sidebar Navigation Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Common Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-surface/70 backdrop-blur-md flex flex-col shrink-0">
          <div className="p-4 space-y-1.5 border-b border-border">
            <span className="font-mono text-[10px] font-bold text-textMuted tracking-widest uppercase block mb-2 px-2">
              COMMON NAVIGATION
            </span>
            
            {[
              { id: "questions", label: "Idea Intake", icon: Rocket, action: () => go("questions") },
              { id: "select", label: "Agent Selection", icon: Sliders, action: () => go("select") },
              { id: "results", label: "Results Thread", icon: MessageSquare, action: () => { go("results"); setActiveTab("results"); } },
              { id: "analytics", label: "Analytics & Graphs", icon: BarChart3, action: () => { go("results"); setActiveTab("analytics"); } },
              { id: "console", label: "Terminal Console", icon: Terminal, action: () => { go("results"); setActiveTab("console"); } },
              { id: "matrix", label: "Swarm Efficiency", icon: Cpu, action: () => { go("results"); setActiveTab("matrix"); } },
              { id: "history", label: "Past History", icon: History, action: () => go("history") },
              { id: "profile", label: "Founder Profile", icon: User, action: () => go("profile") },
              { id: "settings", label: "Workspace Settings", icon: Settings, action: () => go("settings") }
            ].map((item) => {
              const ItemIcon = item.icon;
              const isCurrentPage = activeTab === item.id || (item.id === "results" && activeTab === "results");
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-left outline-none ${
                    isCurrentPage
                      ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-xs"
                      : "text-textMuted border-transparent hover:text-text hover:bg-surfaceAlt"
                  }`}
                >
                  <ItemIcon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Executed Agents Quick List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-left">
            <span className="font-mono text-[10px] font-bold text-textMuted tracking-widest uppercase block mb-1">
              EXECUTED AGENTS ({selectedAgentsList.length})
            </span>

            {selectedAgentsList.map((a) => {
              const Icon = a.icon;
              const agentColor = getAgentColor(a.key, dark);

              return (
                <div
                  key={a.key}
                  className="flex items-center justify-between p-2 rounded-xl border border-border bg-surface hover:border-cyan-500/40 transition-all"
                  style={{ borderLeftColor: agentColor, borderLeftWidth: "3px" }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${agentColor}18`, color: agentColor }}
                    >
                      <Icon size={12} />
                    </div>
                    <span className="font-mono text-[10px] font-bold truncate text-text">
                      {a.name}
                    </span>
                  </div>

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content Workspace Panel */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 max-w-6xl w-full mx-auto space-y-6 animate-fadeUp text-left">
          
          {/* Active Concept Banner */}
          <div className="bento-card p-6 rounded-3xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                ACTIVE CONCEPT ANALYSIS
              </span>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-text">
                "{intakeData.idea}"
              </h1>
              <p className="text-xs text-textMuted font-mono">
                Sector: <strong className="text-text font-bold">{intakeData.industry || "SaaS / B2B"}</strong> · Executed {selectedAgentsList.length} Specialist Agents
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => go("history")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surfaceAlt border border-border text-text hover:bg-border transition-all cursor-pointer"
              >
                <History size={14} /> History
              </button>
            </div>
          </div>

          {/* VIEW SWITCHER TABS */}
          <div className="flex bg-surface p-1.5 rounded-2xl border border-border shadow-xs max-w-xl font-mono text-xs font-bold">
            {[
              { id: "results", label: "Results Thread", icon: MessageSquare },
              { id: "analytics", label: "Analytics & Graphs", icon: BarChart3 },
              { id: "console", label: "Terminal Console", icon: Terminal },
              { id: "matrix", label: "Swarm Efficiency", icon: Cpu }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer border-none outline-none flex items-center justify-center gap-1.5 ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-xs"
                      : "text-textMuted hover:text-text hover:bg-surfaceAlt"
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: RESULTS THREAD STREAM (WITH PARSED MARKDOWN FORMATTING) */}
          {activeTab === "results" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                  RESULTS THREAD ({selectedAgentsList.length} MESSAGES)
                </span>
                <div className="h-[1px] flex-1 bg-border" />
              </div>

              {selectedAgentsList.map((agent) => {
                const Icon = agent.icon;
                const agentColor = getAgentColor(agent.key, dark);
                const isExpanded = expandedKeys[agent.key];
                const reportText = reports[agent.key] || "";
                const dynamicFlashcards = getFlashcardStats(safeIntake);
                const stats = dynamicFlashcards[agent.key] || null;

                return (
                  <div
                    key={agent.key}
                    className="bento-card rounded-3xl border bg-surface overflow-hidden shadow-xs transition-all text-left space-y-4 p-6 hover:border-cyan-500/40"
                    style={{ borderLeft: `4px solid ${agentColor}` }}
                  >
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs shrink-0"
                          style={{ backgroundColor: `${agentColor}18`, color: agentColor }}
                        >
                          <Icon size={20} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold" style={{ color: agentColor }}>
                              {agent.tag}
                            </span>
                            <span className="font-mono text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ● COMPLETE
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-lg text-text">
                            {agent.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(reportText, agent.key)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-bold bg-surfaceAlt text-text hover:bg-border transition-all cursor-pointer"
                        >
                          {copiedKey === agent.key ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          {copiedKey === agent.key ? "Copied" : "Copy"}
                        </button>

                        <button
                          onClick={() => toggleExpand(agent.key)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border text-xs font-bold bg-surfaceAlt text-text hover:bg-border transition-all cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {isExpanded ? "Collapse" : "Expand"}
                        </button>
                      </div>
                    </div>

                    {stats && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                        {stats.map((s, sIdx) => {
                          const StatIcon = s.icon;
                          return (
                            <div key={sIdx} className="p-3.5 rounded-2xl bg-surfaceAlt border border-border space-y-1 hover:border-cyan-500/30 transition-all">
                              <div className="flex items-center justify-between text-textMuted">
                                <span className="font-mono text-[10px] font-bold uppercase">{s.label}</span>
                                <StatIcon size={13} style={{ color: s.color }} />
                              </div>
                              <span className="font-display font-extrabold text-sm sm:text-base text-text block">
                                {s.value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {agent.key === "pitchDeck" && (
                      <PitchDeckSlidePreview intakeData={safeIntake} />
                    )}

                    {/* Rich Formatted Markdown Output (NO RAW ** ASTERISKS) */}
                    <div className={`p-5 rounded-2xl bg-surfaceAlt border border-border font-body text-xs text-text leading-relaxed ${
                      !isExpanded ? "line-clamp-6" : ""
                    }`}>
                      {renderFormattedText(reportText)}
                    </div>

                    {!isExpanded && (
                      <div className="text-center pt-1">
                        <button
                          onClick={() => toggleExpand(agent.key)}
                          className="text-xs font-bold text-cyan-400 hover:underline border-none bg-transparent cursor-pointer"
                        >
                          Show Full {agent.name} Report ↓
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: ANALYTICS & CHARTS */}
          {activeTab === "analytics" && (
            <AnalyticsVisuals intakeData={safeIntake} />
          )}

          {/* TAB 3: TERMINAL CONSOLE LOGS */}
          {activeTab === "console" && (
            <SwarmTerminalConsole reports={reports} selectedAgentsList={selectedAgentsList} />
          )}

          {/* TAB 4: SWARM EFFICIENCY MATRIX */}
          {activeTab === "matrix" && (
            <SwarmEfficiencyMatrix />
          )}

        </main>
      </div>

    </div>
  );
}
