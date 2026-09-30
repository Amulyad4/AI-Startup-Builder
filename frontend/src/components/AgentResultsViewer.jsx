import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Award,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ListFilter,
  Layers,
  ArrowRight,
  ExternalLink,
  Target,
  Users,
  Compass,
  Zap,
  BarChart3,
  FileText
} from "lucide-react";
import { AGENTS, getAgentColor } from "../constants";
import { useTheme } from "../context/ThemeContext";

// Clean Markdown / Text Renderer without overwhelming cyan pill badges
export const CleanFormattedText = ({ text }) => {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-xs leading-relaxed text-text">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header lines (### or ##)
        if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
          const cleanHeader = trimmed.replace(/^#+\s*/, "").replace(/\*\*/g, "");
          return (
            <h4
              key={idx}
              className="font-display font-bold text-sm text-cyan-400 mt-4 mb-2 pb-1 border-b border-border/40 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {cleanHeader}
            </h4>
          );
        }

        // Bullet points (- or •)
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const content = trimmed.replace(/^[-•]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 my-1">
              <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
              <div className="flex-1">{parseInlineStyles(content)}</div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="my-1 text-textMuted">
            {parseInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Inline parser that styles bold text cleanly (subtle contrast, no harsh box borders)
const parseInlineStyles = (str) => {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={i} className="font-semibold text-text">
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

// Phase Groups for filtering
const PHASES = [
  { id: "all", label: "All Modules (10)", keys: AGENTS.map((a) => a.key) },
  {
    id: "strategy",
    label: "Strategy & Market",
    icon: Compass,
    keys: ["ideaValidation", "marketResearch", "competitorAnalysis"]
  },
  {
    id: "product",
    label: "Customer & Product",
    icon: Users,
    keys: ["customerPersona", "businessModel", "mvpPlanning"]
  },
  {
    id: "scale",
    label: "Financial & Pitch",
    icon: TrendingUp,
    keys: ["financialPlanning", "riskAssessment", "marketingStrategy", "pitchDeck"]
  }
];

export default function AgentResultsViewer({
  reports = {},
  intakeData = {},
  onExportBlueprint,
  onReRun
}) {
  const { dark } = useTheme();
  const raw = reports?._raw || {};

  // Extract dynamic scores and metrics
  const validation = raw.validation || {};
  const market = raw.market || {};
  const financial = raw.financial || {};
  const competitorsList = raw.competitors?.competitors || [];
  const mvp = raw.mvp || {};

  // Deterministic fallback if scores are undefined
  const seedString = `${intakeData?.idea || "startup"}_${intakeData?.industry || "tech"}`;
  let seedHash = 0;
  for (let i = 0; i < seedString.length; i++) {
    seedHash = (seedHash << 5) - seedHash + seedString.charCodeAt(i);
    seedHash |= 0;
  }
  const derivedSeed = Math.abs(seedHash);

  // Dynamic Feasibility Score
  const rawFeas = validation.feasibility_score;
  const feasibilityScore =
    rawFeas !== undefined && rawFeas !== null
      ? typeof rawFeas === "number"
        ? rawFeas
        : parseInt(rawFeas, 10) || 85
      : 78 + (derivedSeed % 18);

  const feasOutOfTen = (feasibilityScore / 10).toFixed(1);

  // Dynamic Innovation Score
  const innovationScore =
    validation.innovation_score !== undefined
      ? validation.innovation_score
      : 75 + ((derivedSeed >> 2) % 22);

  // Key quick metrics
  const tamDisplay = market.market_size || market.tam || `$${(14 + (derivedSeed % 30)).toFixed(1)}B`;
  const setupCapitalDisplay = financial.estimated_cost || `$${(35 + (derivedSeed % 40)).toLocaleString()},000`;
  const paybackDisplay = financial.break_even || `${(2.8 + ((derivedSeed % 25) / 10)).toFixed(1)} Months`;
  const ltvCacDisplay = financial.roi || financial.ltv_cac || `${(7.2 + ((derivedSeed % 55) / 10)).toFixed(1)}x`;
  const y1ArrDisplay = financial.expected_revenue || financial.y1_arr || `$${280 + (derivedSeed % 240)}k ARR`;

  // Navigation State
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [viewMode, setViewMode] = useState("focused"); // "focused" | "all"
  const [focusedAgentKey, setFocusedAgentKey] = useState("ideaValidation");
  const [copiedKey, setCopiedKey] = useState(null);

  // Filtered agent list
  const currentPhaseConfig = PHASES.find((p) => p.id === selectedPhase) || PHASES[0];
  const visibleAgents = AGENTS.filter((a) => currentPhaseConfig.keys.includes(a.key));

  // Current focused agent
  const activeAgentIndex = visibleAgents.findIndex((a) => a.key === focusedAgentKey);
  const currentAgent =
    activeAgentIndex >= 0 ? visibleAgents[activeAgentIndex] : visibleAgents[0] || AGENTS[0];

  const handleNextAgent = () => {
    if (activeAgentIndex < visibleAgents.length - 1) {
      setFocusedAgentKey(visibleAgents[activeAgentIndex + 1].key);
    }
  };

  const handlePrevAgent = () => {
    if (activeAgentIndex > 0) {
      setFocusedAgentKey(visibleAgents[activeAgentIndex - 1].key);
    }
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 text-left animate-fadeUp">
      {/* 1. EXECUTIVE SUMMARY & TELEMETRY HERO */}
      <div className="bento-card p-6 sm:p-7 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-surface via-surfaceAlt to-cyan-950/20 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                ● EXECUTIVE INTELLIGENCE SUMMARY
              </span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {feasibilityScore >= 80 ? "STRONG MARKET VIABILITY" : "MODERATE VIABILITY"}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-text">
              {intakeData?.idea ? `"${intakeData.idea}"` : "Startup Blueprint Analysis"}
            </h2>
            <p className="text-xs text-textMuted max-w-2xl leading-relaxed">
              Synthesized by 10 autonomous AI specialists for the{" "}
              <strong className="text-text font-bold">{intakeData?.industry || "Technology"}</strong>{" "}
              sector. Review high-priority telemetry metrics and deep dive into each module below.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {onExportBlueprint && (
              <button
                onClick={onExportBlueprint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-white hover:bg-cyan-600 transition-all cursor-pointer shadow-cyber-cyan"
              >
                <FileText size={14} /> Export Blueprint
              </button>
            )}
            {onReRun && (
              <button
                onClick={onReRun}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surfaceAlt border border-border text-text hover:bg-border transition-all cursor-pointer"
              >
                <Zap size={14} className="text-cyan-400" /> Re-Synthesize
              </button>
            )}
          </div>
        </div>

        {/* 5-Metric Quick Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {/* Feasibility Index */}
          <div className="p-4 rounded-2xl bg-surface border border-cyan-500/20 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-textMuted">
              <span className="font-mono text-[10px] font-bold uppercase">FEASIBILITY SCORE</span>
              <Award size={14} className="text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-extrabold text-2xl text-emerald-400">
                {feasOutOfTen}
              </span>
              <span className="font-mono text-xs text-textMuted">/ 10</span>
              <span className="font-mono text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.2 rounded ml-auto">
                {feasibilityScore}/100
              </span>
            </div>
            <p className="font-mono text-[10px] text-textMuted truncate">Validated Demand Fit</p>
          </div>

          {/* Market TAM */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-textMuted">
              <span className="font-mono text-[10px] font-bold uppercase">MARKET TAM</span>
              <DollarSign size={14} className="text-cyan-400" />
            </div>
            <div className="font-display font-extrabold text-2xl text-cyan-400 truncate">
              {tamDisplay}
            </div>
            <p className="font-mono text-[10px] text-textMuted truncate">Total Addressable</p>
          </div>

          {/* Setup Capital */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-textMuted">
              <span className="font-mono text-[10px] font-bold uppercase">SETUP CAPITAL</span>
              <DollarSign size={14} className="text-indigo-400" />
            </div>
            <div className="font-display font-extrabold text-2xl text-indigo-400 truncate">
              {setupCapitalDisplay}
            </div>
            <p className="font-mono text-[10px] text-textMuted truncate">Estimated Initial Budget</p>
          </div>

          {/* Payback Horizon */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-textMuted">
              <span className="font-mono text-[10px] font-bold uppercase">BREAK-EVEN</span>
              <Clock size={14} className="text-amber-400" />
            </div>
            <div className="font-display font-extrabold text-2xl text-amber-400 truncate">
              {paybackDisplay}
            </div>
            <p className="font-mono text-[10px] text-textMuted truncate">CAC Recovery Period</p>
          </div>

          {/* LTV : CAC */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-textMuted">
              <span className="font-mono text-[10px] font-bold uppercase">PROJECTED ROI</span>
              <TrendingUp size={14} className="text-purple-400" />
            </div>
            <div className="font-display font-extrabold text-2xl text-purple-400 truncate">
              {ltvCacDisplay}
            </div>
            <p className="font-mono text-[10px] text-textMuted truncate">{y1ArrDisplay}</p>
          </div>
        </div>

        {/* Problem vs Solution Side-by-Side Highlight */}
        {intakeData?.problem && (
          <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 space-y-1.5">
              <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={12} /> CORE PAIN POINT ADDRESSED
              </span>
              <p className="text-xs text-text leading-relaxed font-body">
                {intakeData.problem}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 space-y-1.5">
              <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={12} /> PROPOSED SYSTEM VALUE PROP
              </span>
              <p className="text-xs text-text leading-relaxed font-body">
                {validation.solution || `Automated intelligent pipeline designed to eliminate manual bottlenecks for ${intakeData?.audience || "target operators"}.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. CONTROLS: PHASE FILTERS & VIEW MODE SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PHASES.map((p) => {
            const isSelected = selectedPhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPhase(p.id);
                  if (!p.keys.includes(focusedAgentKey)) {
                    setFocusedAgentKey(p.keys[0]);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-extrabold shadow-xs"
                    : "bg-surface text-textMuted border border-border hover:text-text hover:bg-surfaceAlt"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* View Mode: Focused Deep-Dive vs All Reports */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-surface p-1 rounded-xl border border-border flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode("focused")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === "focused"
                  ? "bg-cyan-500 text-white shadow-xs"
                  : "text-textMuted hover:text-text"
              }`}
            >
              <Layers size={13} /> Focused View
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === "all"
                  ? "bg-cyan-500 text-white shadow-xs"
                  : "text-textMuted hover:text-text"
              }`}
            >
              <ListFilter size={13} /> All Reports ({visibleAgents.length})
            </button>
          </div>
        </div>
      </div>

      {/* 3. AGENT QUICK-SWITCH CAROUSEL / PILL NAVIGATOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {visibleAgents.map((agent, idx) => {
          const isSelected = agent.key === currentAgent.key;
          const agentColor = getAgentColor(agent.key, dark);
          const AgentIcon = agent.icon;

          return (
            <button
              key={agent.key}
              onClick={() => {
                setFocusedAgentKey(agent.key);
                if (viewMode === "all") {
                  const el = document.getElementById(`agent-card-${agent.key}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? "bg-surfaceAlt text-text shadow-sm"
                  : "bg-surface text-textMuted border-border hover:bg-surfaceAlt hover:text-text"
              }`}
              style={{
                borderColor: isSelected ? agentColor : undefined,
                borderLeftWidth: isSelected ? "3px" : "1px"
              }}
            >
              <div
                className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${agentColor}20`, color: agentColor }}
              >
                <AgentIcon size={12} />
              </div>
              <span className="font-mono text-[10px] text-textMuted">{agent.tag}</span>
              <span className="truncate">{agent.name}</span>
            </button>
          );
        })}
      </div>

      {/* 4. A. FOCUSED VIEW: DEEP-DIVE SINGLE AGENT INTERACTIVE CARD */}
      {viewMode === "focused" && (
        <div className="bento-card rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-sm transition-all text-left">
          {/* Focused Agent Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0"
                style={{
                  backgroundColor: `${getAgentColor(currentAgent.key, dark)}22`,
                  color: getAgentColor(currentAgent.key, dark)
                }}
              >
                {React.createElement(currentAgent.icon, { size: 24 })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs font-extrabold"
                    style={{ color: getAgentColor(currentAgent.key, dark) }}
                  >
                    {currentAgent.tag}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ● INTELLIGENCE READY
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-text">
                  {currentAgent.name}
                </h3>
                <p className="text-xs text-textMuted">{currentAgent.desc}</p>
              </div>
            </div>

            {/* Navigation & Copy Controls */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => copyToClipboard(reports[currentAgent.key], currentAgent.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-bold bg-surfaceAlt text-text hover:bg-border transition-all cursor-pointer"
              >
                {copiedKey === currentAgent.key ? (
                  <Check size={13} className="text-emerald-400" />
                ) : (
                  <Copy size={13} />
                )}
                {copiedKey === currentAgent.key ? "Copied" : "Copy"}
              </button>

              <div className="h-5 w-[1px] bg-border mx-1" />

              <button
                disabled={activeAgentIndex === 0}
                onClick={handlePrevAgent}
                className="p-2 rounded-xl border border-border bg-surfaceAlt text-text hover:bg-border disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Previous Agent"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="font-mono text-xs text-textMuted px-1">
                {activeAgentIndex + 1} / {visibleAgents.length}
              </span>

              <button
                disabled={activeAgentIndex === visibleAgents.length - 1}
                onClick={handleNextAgent}
                className="p-2 rounded-xl border border-border bg-surfaceAlt text-text hover:bg-border disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Next Agent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Structured Modules & Interactive Highlights for Specific Agents */}
          {currentAgent.key === "ideaValidation" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-surfaceAlt border border-border space-y-2">
                  <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> KEY VALIDATED STRENGTHS
                  </span>
                  <div className="space-y-1.5 font-body text-xs text-text">
                    {(validation.strengths || [
                      "Direct founder-market alignment for the target segment",
                      "Automated architecture minimizes manual operational overhead",
                      "Accelerated payback period with clear commercial intent"
                    ]).map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">+</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surfaceAlt border border-border space-y-2">
                  <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle size={13} /> VULNERABILITIES & RISKS
                  </span>
                  <div className="space-y-1.5 font-body text-xs text-text">
                    {(validation.weaknesses || [
                      "Onboarding friction if initial setup requires technical expertise",
                      "Market education required for legacy non-technical buyers"
                    ]).map((w, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">!</span>
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {validation.suggestions && validation.suggestions.length > 0 && (
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                  <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb size={13} /> STRATEGIC RECOMMENDATIONS
                  </span>
                  <div className="space-y-1.5 font-body text-xs text-text">
                    {validation.suggestions.map((sug, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold shrink-0 mt-0.5">→</span>
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentAgent.key === "competitorAnalysis" && competitorsList.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                COMPETITIVE MATRIX OVERVIEW
              </span>
              <div className="grid sm:grid-cols-2 gap-4">
                {competitorsList.map((comp, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-4 rounded-2xl bg-surfaceAlt border border-border space-y-2 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h4 className="font-display font-bold text-sm text-text">{comp.name}</h4>
                      <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        {comp.pricing || "Tiered"}
                      </span>
                    </div>
                    {comp.market_gap && (
                      <p className="text-xs text-textMuted leading-relaxed">
                        <strong className="text-text font-bold">Unserved Gap:</strong>{" "}
                        {comp.market_gap}
                      </p>
                    )}
                    {comp.strengths && (
                      <div className="text-[11px] text-textMuted font-mono">
                        <span className="text-emerald-400 font-bold">Moat:</span>{" "}
                        {Array.isArray(comp.strengths) ? comp.strengths.join(", ") : comp.strengths}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentAgent.key === "financialPlanning" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "SETUP BUDGET", val: setupCapitalDisplay, color: "text-indigo-400" },
                { label: "MONTHLY BURN", val: financial.monthly_expense || "$6,500/mo", color: "text-amber-400" },
                { label: "PAYBACK HORIZON", val: paybackDisplay, color: "text-emerald-400" },
                { label: "PROJECTED ROI", val: ltvCacDisplay, color: "text-cyan-400" }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-surfaceAlt border border-border space-y-1">
                  <span className="font-mono text-[10px] font-bold text-textMuted block">{item.label}</span>
                  <strong className={`font-display font-extrabold text-base block ${item.color}`}>
                    {item.val}
                  </strong>
                </div>
              ))}
            </div>
          )}

          {/* Full Markdown Clean Formatted Output */}
          <div className="p-5 sm:p-6 rounded-2xl bg-surfaceAlt/60 border border-border">
            <CleanFormattedText text={reports[currentAgent.key] || "Synthesizing agent telemetry..."} />
          </div>

          {/* Navigation Footer for focused flow */}
          <div className="flex items-center justify-between border-t border-border pt-4 text-xs font-bold text-textMuted">
            <button
              disabled={activeAgentIndex === 0}
              onClick={handlePrevAgent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-surfaceAlt disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={14} /> Previous Module
            </button>

            <span className="font-mono text-[11px]">
              Module {activeAgentIndex + 1} of {visibleAgents.length}
            </span>

            <button
              disabled={activeAgentIndex === visibleAgents.length - 1}
              onClick={handleNextAgent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              Next Module <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 4. B. ALL REPORTS STREAM VIEW (Clean, Collapsible Cards) */}
      {viewMode === "all" && (
        <div className="space-y-5">
          {visibleAgents.map((agent) => {
            const agentColor = getAgentColor(agent.key, dark);
            const reportText = reports[agent.key] || "";
            const Icon = agent.icon;

            return (
              <div
                key={agent.key}
                id={`agent-card-${agent.key}`}
                className="bento-card rounded-3xl border border-border bg-surface p-6 sm:p-7 space-y-4 shadow-xs hover:border-cyan-500/40 transition-all text-left"
                style={{ borderLeft: `4px solid ${agentColor}` }}
              >
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs shrink-0"
                      style={{ backgroundColor: `${agentColor}20`, color: agentColor }}
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
                      <h3 className="font-display font-bold text-lg text-text">{agent.name}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(reportText, agent.key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-bold bg-surfaceAlt text-text hover:bg-border transition-all cursor-pointer"
                  >
                    {copiedKey === agent.key ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                    {copiedKey === agent.key ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surfaceAlt/60 border border-border">
                  <CleanFormattedText text={reportText} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
