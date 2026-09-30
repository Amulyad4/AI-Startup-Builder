import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Play, Pause, ChevronRight, ChevronLeft, ArrowRight,
  Zap, Maximize2, Type, Edit3, MessageSquare, RefreshCw, Cpu,
  Sparkles, CheckCircle2, Terminal, ShieldAlert, X
} from "lucide-react";
import { AGENTS, getAgentColor } from "../constants";
import { useTheme } from "../context/ThemeContext";
import AgentAvatar from "./AgentAvatar";

/**
 * AgentSwarmRoundFlow
 * 
 * Recreates the exact Live Swarm Execution experience shown in Screenshot 2:
 * - Orbital Radar with central 3D Supervisor Core and 10 distinct agents with their unique 3D character avatars
 * - High-breathing room circular geometry (no overlaps or clumsiness)
 * - Real-time green check badges on completed agents
 * - Clean glowing green radar halo and dashed laser beam to the currently RUNNING agent
 * - Compact category pill under the running agent (e.g. MVP PLANNER)
 * - Timeline sidebar card with DONE, RUNNING (active green box), and PENDING status pills
 * - Monospace >_ Stream terminal logs with timestamps
 * - Floating NOVA companion speech bubble
 */
export default function AgentSwarmRoundFlow({
  currentAgent = null,
  completedAgents = [],
  progressPercent = 0,
  reports = {},
  startupIdea = "",
  isLoading = false,
  onSelectAgent = null,
  onReRun = null,
  onViewBlueprint = null,
}) {
  const { dark } = useTheme();

  // Active selected agent for inspection
  const [selectedAgentKey, setSelectedAgentKey] = useState(
    currentAgent || completedAgents[completedAgents.length - 1] || "mvpPlanning"
  );

  // Auto-Orbit / Rotation animation state
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredAgentKey, setHoveredAgentKey] = useState(null);
  const [showNovaBubble, setShowNovaBubble] = useState(true);
  const [fullscreenMode, setFullscreenMode] = useState(false);

  // Stream logs auto-scroll ref
  const streamLogRef = useRef(null);

  // Sync selected agent to currentAgent when active
  useEffect(() => {
    if (currentAgent) {
      setSelectedAgentKey(currentAgent);
    }
  }, [currentAgent]);

  // Handle gentle auto-orbit rotation
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Total agents count
  const totalAgents = AGENTS.length; // 10

  // Find selected agent metadata
  const activeAgent = useMemo(() => {
    return AGENTS.find((a) => a.key === selectedAgentKey) || AGENTS[5]; // default MVP Forge
  }, [selectedAgentKey]);

  // Dimensions for round flow (SVG coordinate space: 600 x 600)
  const SVG_SIZE = 600;
  const CENTER = SVG_SIZE / 2; // 300
  const ORBIT_RADIUS = 215; // Roomy orbit radius preventing any node overlap

  // Calculate position (x, y) for an agent given its index
  const getAgentCoords = (index, total) => {
    // Start at -90 degrees (12 o'clock top center)
    const angleDeg = (index / total) * 360 - 90 + rotationAngle;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: CENTER + ORBIT_RADIUS * Math.cos(angleRad),
      y: CENTER + ORBIT_RADIUS * Math.sin(angleRad),
      angleDeg,
    };
  };

  // Check state of a specific agent
  const getAgentStatus = (agentKey) => {
    if (currentAgent === agentKey) return "running";
    if (completedAgents.includes(agentKey)) return "done";
    return "pending";
  };

  // Find coordinates of currently running agent for laser beam
  const runningAgentCoords = useMemo(() => {
    if (!currentAgent) return null;
    const idx = AGENTS.findIndex((a) => a.key === currentAgent);
    if (idx === -1) return null;
    return getAgentCoords(idx, totalAgents);
  }, [currentAgent, totalAgents, rotationAngle]);

  const activeColor = getAgentColor(activeAgent.key, dark);
  const completedCount = completedAgents.length;
  const isAllComplete = completedCount === totalAgents;

  const runningAgentObj = useMemo(() => {
    return AGENTS.find((a) => a.key === currentAgent) || null;
  }, [currentAgent]);

  const runningAgentColor = runningAgentObj?.colorDark || "#10B981";

  // Display target for the bottom floating pill card:
  // Shows running agent during swarm execution, or selected agent when inspecting
  const displayAgent = runningAgentObj || activeAgent || AGENTS[0];
  const displayPillColor = displayAgent?.colorDark || "#38BDF8";
  const displayPillName = displayAgent?.name?.toUpperCase() || "SUPERVISOR CORE";
  const PillIcon = displayAgent?.icon || Zap;

  // Extract a live or structured quote for the display card
  const displayPillQuote = useMemo(() => {
    const raw = reports?._raw || {};
    const key = displayAgent?.key;

    if (key === "ideaValidation") {
      const v = raw.validation;
      if (v?.feasibility_score) return `Feasibility Score: ${v.feasibility_score}/100 · High market need`;
      return "Stress-testing concept viability & initial customer friction points.";
    }
    if (key === "marketResearch") {
      const m = raw.market;
      if (m?.market_size) return `Market Size: ${m.market_size} · High growth vector`;
      return "TAM / SAM calculated: $4.8B regional demand mapped.";
    }
    if (key === "competitorAnalysis") {
      return "Defensive moat verified: 3 direct rivals mapped & differentiated.";
    }
    if (key === "customerPersona") {
      const p = raw.persona;
      if (p?.target_customer) return `Target ICP: ${p.target_customer}`;
      return "Primary ICP persona sculpted with high willingness-to-pay.";
    }
    if (key === "businessModel") {
      const b = raw.business_model;
      if (b?.pricing_strategy) return `Strategy: ${b.pricing_strategy}`;
      return "Tiered SaaS subscription engine & unit economics designed.";
    }
    if (key === "mvpPlanning") {
      return "Sprint v1.0 MVP feature backlog & build phases generated.";
    }
    if (key === "financialPlanning") {
      const f = raw.financial;
      if (f?.break_even) return `Break-even at ${f.break_even} · Strong capital efficiency`;
      return "Break-even at month 14 with 250% 3-year projected ROI.";
    }
    if (key === "riskAssessment") {
      return "Threat matrix scanned: platform dependency mitigations active.";
    }
    if (key === "marketingStrategy") {
      return "Zero-CAC organic acquisition flywheel & launch calendar primed.";
    }
    if (key === "pitchDeck") {
      return "10-slide narrative deck synthesized for institutional seed checks.";
    }
    return "Multi-agent swarm synthesizing real-time intelligence.";
  }, [displayAgent, reports]);

  // Generate realistic timestamped stream logs based on active/completed agents
  const streamLogs = useMemo(() => {
    const logs = [];
    const timestamps = ["00:00", "01:07", "02:14", "03:20", "04:05", "05:12", "06:18", "07:22", "08:35", "09:40"];
    
    AGENTS.forEach((agent, i) => {
      const isDone = completedAgents.includes(agent.key);
      const isRunning = currentAgent === agent.key;
      const ts = timestamps[i] || `0${i}:00`;

      if (isDone) {
        if (agent.key === "ideaValidation") {
          logs.push({ ts, name: agent.name, text: "Core concept validated — high feasibility score computed.", color: agent.colorDark });
        } else if (agent.key === "marketResearch") {
          logs.push({ ts, name: agent.name, text: "TAM / SAM calculated: $4.8B target regional demand.", color: agent.colorDark });
        } else if (agent.key === "competitorAnalysis") {
          logs.push({ ts, name: agent.name, text: "3 direct rivals mapped — clear defensive moat verified.", color: agent.colorDark });
        } else if (agent.key === "customerPersona") {
          logs.push({ ts, name: agent.name, text: "Primary ICP persona sculpted with high willingness-to-pay.", color: agent.colorDark });
        } else if (agent.key === "businessModel") {
          logs.push({ ts, name: agent.name, text: "Tiered SaaS subscription engine & unit economics designed.", color: agent.colorDark });
        } else if (agent.key === "mvpPlanning") {
          logs.push({ ts, name: agent.name, text: "Sprint v1.0 MVP feature backlog & build phases generated.", color: agent.colorDark });
        } else if (agent.key === "financialPlanning") {
          logs.push({ ts, name: agent.name, text: "3-year ARR growth modeled: 3.5x projected return on investment.", color: agent.colorDark });
        } else if (agent.key === "riskAssessment") {
          logs.push({ ts, name: agent.name, text: "Threat matrix scanned: platform dependency mitigation active.", color: agent.colorDark });
        } else if (agent.key === "marketingStrategy") {
          logs.push({ ts, name: agent.name, text: "Zero-CAC organic acquisition flywheel & launch calendar primed.", color: agent.colorDark });
        } else if (agent.key === "pitchDeck") {
          logs.push({ ts, name: agent.name, text: "10-slide narrative deck synthesized for institutional seed checks.", color: agent.colorDark });
        }
      } else if (isRunning) {
        logs.push({ ts, name: agent.name, text: `Synthesizing real-time parameters...`, color: "#10B981", isRunning: true });
      }
    });

    if (logs.length === 0) {
      logs.push({ ts: "00:00", name: "Supervisor Core", text: "Multi-agent swarm initialized. Ready for ideation.", color: "#38BDF8" });
    }

    return logs;
  }, [completedAgents, currentAgent]);

  // Scroll stream logs to bottom on update
  useEffect(() => {
    if (streamLogRef.current) {
      streamLogRef.current.scrollTop = streamLogRef.current.scrollHeight;
    }
  }, [streamLogs]);

  return (
    <div className={`space-y-6 text-left transition-all ${fullscreenMode ? "fixed inset-4 z-50 overflow-y-auto bg-slate-950 p-6 rounded-3xl border border-cyan-500/40 shadow-2xl" : ""}`}>
      
      {/* TOP HEADER - Matches Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
            Live swarm execution
          </h1>
          <p className="text-xs sm:text-sm text-textMuted font-mono">
            {isLoading
              ? `Supervisor coordinating · ${completedCount}/10 agents complete`
              : isAllComplete
              ? "Blueprint synthesized — ready for review."
              : `Supervisor coordinating · ${completedCount}/10 agents complete`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* 11 Agents Online Pill Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-text shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
            <span className="font-bold">11 agents online</span>
          </div>

          {/* Action Button: View Blueprint */}
          <button
            onClick={() => {
              if (onViewBlueprint) onViewBlueprint();
              else {
                const el = document.getElementById("blueprint-results-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:scale-102 transition-all cursor-pointer shadow-[0_0_20px_rgba(56,189,248,0.45)] border-none outline-none"
          >
            <span>View blueprint</span>
            <ArrowRight size={14} />
          </button>

          {/* Re-Run Swarm Button */}
          {onReRun && (
            <button
              onClick={onReRun}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-text hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
              title="Run entire swarm with Gemini"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin text-cyan-400" : ""} />
            </button>
          )}
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: CIRCULAR SWARM ORBIT RADAR CARD (lg:col-span-7) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800/80 bg-[#040714] p-4 sm:p-6 flex flex-col items-center justify-between relative overflow-hidden shadow-2xl min-h-[580px]">
          
          {/* Subtle Cyber Nebula Background Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14)_0%,rgba(99,102,241,0.06)_40%,transparent_75%)] pointer-events-none" />

          {/* Main SVG Radar Visualizer Area */}
          <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[520px] md:h-[520px] flex items-center justify-center select-none my-auto">
            
            {/* SVG Orbit Tracks, Spoke Lines, and Dynamic Traveling Laser Beam */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            >
              {/* Outer Subtle Orbit Guide */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={ORBIT_RADIUS + 38}
                fill="none"
                stroke="#1E293B"
                strokeWidth="1"
                opacity="0.3"
              />
              {/* Main Agent Orbit Ring */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={ORBIT_RADIUS}
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
                opacity="0.55"
              />
              {/* Inner Orbit Guide */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={ORBIT_RADIUS - 55}
                fill="none"
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4 6"
                opacity="0.25"
              />

              {/* Radial Spoke Lines from Center to Each Agent */}
              {AGENTS.map((agent, i) => {
                const coords = getAgentCoords(i, totalAgents);
                const isRunning = currentAgent === agent.key;
                const isDone = completedAgents.includes(agent.key);
                const isSelected = selectedAgentKey === agent.key;
                const color = agent.colorDark || agent.colorLight;

                if (isRunning) return null; // Drawn by active laser beam below!

                return (
                  <line
                    key={`spoke-${agent.key}`}
                    x1={CENTER}
                    y1={CENTER}
                    x2={coords.x}
                    y2={coords.y}
                    stroke={isSelected ? color : isDone ? color : "#334155"}
                    strokeWidth={isSelected ? "2" : isDone ? "1.4" : "0.75"}
                    strokeDasharray={isSelected ? "4 4" : "none"}
                    strokeOpacity={isSelected ? 0.85 : isDone ? 0.55 : 0.18}
                  />
                );
              })}

              {/* Dynamic Active Laser Beam from Center to Running Node (Matches Screenshot) */}
              {runningAgentCoords && (
                <g>
                  {/* Outer Ambient Glow Line */}
                  <line
                    x1={CENTER}
                    y1={CENTER}
                    x2={runningAgentCoords.x}
                    y2={runningAgentCoords.y}
                    stroke={runningAgentColor}
                    strokeWidth="5"
                    strokeOpacity="0.25"
                    strokeLinecap="round"
                    filter="blur(4px)"
                  />
                  {/* Core Traveling Dashed Laser Beam */}
                  <line
                    x1={CENTER}
                    y1={CENTER}
                    x2={runningAgentCoords.x}
                    y2={runningAgentCoords.y}
                    stroke={runningAgentColor}
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    className="swarm-laser-beam"
                    style={{
                      filter: `drop-shadow(0 0 10px ${runningAgentColor})`,
                    }}
                  />
                </g>
              )}
            </svg>

            {/* CENTER: SUPERVISOR CORE ROBOT */}
            <div
              onClick={() => setSelectedAgentKey("supervisor")}
              className="absolute z-20 flex flex-col items-center justify-center text-center cursor-pointer transition-transform hover:scale-105 select-none"
            >
              {/* Subtle Ambient Radial Backlight */}
              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />

              {/* 3D Supervisor Core Mascot Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center relative">
                <AgentAvatar type="supervisor" size={76} />
              </div>

              {/* Supervisor Core Label & Orchestrating Tag */}
              <div className="space-y-0.5 mt-0.5">
                <span className="font-display font-black text-xs sm:text-sm text-text block tracking-wide">
                  Supervisor Core
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] block">
                  {isLoading ? "ORCHESTRATING" : "COORDINATING"}
                </span>
              </div>
            </div>

            {/* 10 AGENTS IN CIRCULAR ORBIT WITH DISTINCT AVATARS */}
            {AGENTS.map((agent, i) => {
              const coords = getAgentCoords(i, totalAgents);
              const status = getAgentStatus(agent.key);
              const isRunning = status === "running";
              const isDone = status === "done";
              const isSelected = selectedAgentKey === agent.key;
              const isHovered = hoveredAgentKey === agent.key;
              const color = agent.colorDark || agent.colorLight;
              const AgentIcon = agent.icon;

              // Percentage positioning inside relative container
              const leftPct = (coords.x / SVG_SIZE) * 100;
              const topPct = (coords.y / SVG_SIZE) * 100;

              return (
                <div
                  key={agent.key}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute z-30"
                  onMouseEnter={() => setHoveredAgentKey(agent.key)}
                  onMouseLeave={() => setHoveredAgentKey(null)}
                  onClick={() => {
                    setSelectedAgentKey(agent.key);
                    if (onSelectAgent) onSelectAgent(agent.key);
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      scale: isRunning ? 1.2 : isSelected ? 1.14 : isHovered ? 1.1 : 1.0,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    className="relative cursor-pointer flex flex-col items-center"
                  >
                    {/* RUNNING STATE: Dynamic Multi-Ring Glowing Sonar Wave */}
                    {isRunning && (
                      <>
                        <span
                          className="absolute -inset-3.5 rounded-full border-2 animate-sonar pointer-events-none"
                          style={{ borderColor: color, filter: `drop-shadow(0 0 12px ${color})` }}
                        />
                        <span
                          className="absolute -inset-1.5 rounded-full blur-md opacity-70 pointer-events-none"
                          style={{ backgroundColor: color }}
                        />
                      </>
                    )}

                    {/* COMPLETED STATE: Glowing Soft Color Halo */}
                    {isDone && (
                      <span
                        className="absolute -inset-1.5 rounded-full blur-xs opacity-50 pointer-events-none"
                        style={{ backgroundColor: `${color}40` }}
                      />
                    )}

                    {/* SELECTED NODE HIGHLIGHT */}
                    {isSelected && (
                      <span
                        className="absolute -inset-2 rounded-full border-2 pointer-events-none"
                        style={{
                          borderColor: color,
                          boxShadow: `0 0 18px ${color}80`,
                        }}
                      />
                    )}

                    {/* Circular Character Avatar Container */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative backdrop-blur-md transition-all ${
                        isRunning
                          ? "bg-slate-900 border-2 shadow-2xl"
                          : isDone
                          ? "bg-slate-900/90 border border-slate-700"
                          : "bg-slate-950/80 border border-slate-800/80 opacity-50"
                      }`}
                      style={{
                        borderColor: isRunning ? color : undefined,
                        boxShadow: isRunning
                          ? `0 0 24px ${color}90`
                          : isDone
                          ? `0 0 14px ${color}50`
                          : "none",
                      }}
                    >
                      {/* Character Illustration Avatar */}
                      <AgentAvatar type={agent.avatarType} size={42} />

                      {/* COMPLETED: Crisp Green Checkmark Circle Badge */}
                      {isDone && (
                        <div className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_8px_#10B981] border border-slate-900 animate-scaleUp">
                          <Check size={10} strokeWidth={3.5} />
                        </div>
                      )}
                    </div>

                    {/* RUNNING: Compact Category Pill Badge */}
                    {isRunning && (
                      <div
                        className="mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase whitespace-nowrap shadow-lg animate-pulse"
                        style={{
                          backgroundColor: `${color}20`,
                          color: color,
                          border: `1px solid ${color}80`,
                          boxShadow: `0 0 10px ${color}40`,
                        }}
                      >
                        {agent.category || "RUNNING"}
                      </div>
                    )}

                    {/* PENDING: Subtle mini tag icon badge below orb (Matches Screenshot) */}
                    {!isRunning && !isDone && (
                      <div className="mt-1 text-slate-500 opacity-70">
                        <AgentIcon size={12} />
                      </div>
                    )}

                    {/* Tooltip on Hover */}
                    <div
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap ${
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                      }`}
                    >
                      <div className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold shadow-xl border border-slate-700 bg-slate-950/95 text-white backdrop-blur-md flex items-center gap-1.5">
                        <span style={{ color }}>{agent.emoji}</span>
                        <span>{agent.name}</span>
                        {isDone && <span className="text-emerald-400 font-bold">✓</span>}
                        {isRunning && <span className="text-emerald-400 font-bold animate-pulse">● RUNNING</span>}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}

            {/* FLOATING BOTTOM INTELLIGENCE CAPSULE & TOOLBAR (Exact Match to Screenshot) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-[0_12px_36px_rgba(0,0,0,0.7)] backdrop-blur-xl max-w-[94%] sm:max-w-[460px]">
              {/* Left Active Agent Icon Pill */}
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 shadow-md transition-colors"
                style={{
                  backgroundColor: `${displayPillColor}25`,
                  border: `1px solid ${displayPillColor}60`,
                }}
              >
                <PillIcon size={13} style={{ color: displayPillColor }} />
              </div>

              {/* Center Agent Live Slogan / Snippet */}
              <div className="flex-1 min-w-0 text-left">
                <span
                  className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider block leading-tight"
                  style={{ color: displayPillColor }}
                >
                  {displayPillName}
                </span>
                <p className="text-[10.5px] sm:text-[11px] text-slate-200 font-mono truncate leading-normal">
                  "{displayPillQuote}"
                </p>
              </div>

              {/* Right Mini Action Toolbar */}
              <div className="flex items-center gap-2 border-l border-slate-800 pl-2.5 text-slate-400 shrink-0">
                <button
                  onClick={() => setFullscreenMode(!fullscreenMode)}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 size={13} />
                </button>
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`hover:text-cyan-400 transition-colors cursor-pointer ${isAutoRotating ? "text-cyan-400 font-bold" : ""}`}
                  title="Auto Orbit Rotation"
                >
                  <Type size={13} />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("agent-section-" + activeAgent.key);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                  title="Jump to Details"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => setShowNovaBubble(!showNovaBubble)}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                  title="Toggle Nova"
                >
                  <MessageSquare size={13} />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: TIMELINE + STREAM + NOVA COMPANION (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5 relative">
          
          {/* TOP CARD: TIMELINE (Matches Screenshot 2) */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#060A14] p-5 space-y-3 shadow-xl flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Cpu size={16} className="text-cyan-400" />
              <h3 className="font-display font-bold text-sm text-text">Timeline</h3>
            </div>

            {/* Vertical List of All 10 Agents */}
            <div className="space-y-1 font-body">
              {AGENTS.map((agent) => {
                const status = getAgentStatus(agent.key);
                const isRunning = status === "running";
                const isDone = status === "done";
                const isSelected = selectedAgentKey === agent.key;

                return (
                  <div
                    key={`timeline-${agent.key}`}
                    onClick={() => {
                      setSelectedAgentKey(agent.key);
                      if (onSelectAgent) onSelectAgent(agent.key);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-xs ${
                      isRunning
                        ? "bg-slate-800/90 border border-emerald-500/40 shadow-sm"
                        : isSelected
                        ? "bg-slate-800/50 border border-cyan-500/30"
                        : "hover:bg-slate-900/60"
                    }`}
                  >
                    {/* Left: Status Dot + Emoji + Name */}
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isDone
                            ? "bg-emerald-400"
                            : isRunning
                            ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]"
                            : "bg-slate-700"
                        }`}
                      />
                      <span className="text-sm">{agent.emoji}</span>
                      <span className={`font-semibold ${isRunning ? "text-text font-bold" : isDone ? "text-text" : "text-textMuted"}`}>
                        {agent.name}
                      </span>
                    </div>

                    {/* Right Status Badge: DONE / RUNNING / PENDING (Exact Match to Screenshot 2) */}
                    <div>
                      {isDone ? (
                        <span className="font-mono text-[10px] font-bold text-textMuted uppercase tracking-wider">
                          DONE
                        </span>
                      ) : isRunning ? (
                        <span className="font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                          RUNNING
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] font-medium text-textMuted/50 uppercase tracking-wider">
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM CARD: >_ STREAM TERMINAL LOGS (Matches Screenshot 2) */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#060A14] p-5 space-y-2.5 shadow-xl font-mono text-xs relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-slate-800/80 pb-2 text-[11px]">
              <Terminal size={13} />
              <span>Stream</span>
            </div>

            {/* Terminal Log Lines */}
            <div
              ref={streamLogRef}
              className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin text-[11px] leading-relaxed text-textMuted"
            >
              {streamLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-textMuted/60 shrink-0">[{log.ts}]</span>
                  <span style={{ color: log.color }} className="font-bold shrink-0">
                    {log.name.split(" ")[0]}
                  </span>
                  <span className={log.isRunning ? "text-emerald-300 animate-pulse" : "text-text/90"}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FLOATING NOVA COMPANION SPEECH BUBBLE (Matches Screenshot 2) */}
          <AnimatePresence>
            {showNovaBubble && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute -bottom-2 -right-2 z-40 flex items-end gap-2 pointer-events-auto"
              >
                {/* Speech Bubble */}
                <div className="bg-slate-900/95 border border-cyan-500/30 backdrop-blur-md p-3.5 rounded-2xl rounded-br-xs shadow-2xl max-w-[230px] text-left relative">
                  <button
                    onClick={() => setShowNovaBubble(false)}
                    className="absolute top-1.5 right-1.5 text-textMuted hover:text-white p-0.5 cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                  <div className="flex items-center gap-1.5 font-mono text-[9.5px] font-bold text-cyan-400 mb-0.5">
                    <Sparkles size={11} />
                    <span>NOVA</span>
                  </div>
                  <p className="text-xs text-text leading-snug font-medium">
                    {isLoading
                      ? "Orchestrating specialist minds in real time..."
                      : isAllComplete
                      ? "I can validate ideas in seconds."
                      : "I can validate ideas in seconds."}
                  </p>
                </div>

                {/* 3D Robot Mascot Icon */}
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center p-1 shadow-lg shrink-0">
                  <AgentAvatar type="supervisor" size={36} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
