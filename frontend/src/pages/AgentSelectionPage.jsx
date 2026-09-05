import React, { useState } from "react";
import { 
  Bot, Sparkles, Check, CheckSquare, Square, Rocket, ArrowRight,
  ChevronLeft, ShieldCheck, FileText, Cpu, BarChart3, Presentation, Compass
} from "lucide-react";
import { AGENTS, getAgentColor } from "../constants";
import { useTheme } from "../context/ThemeContext";
import NeuralAgentMatrix from "../components/NeuralAgentMatrix";
import Footer from "../components/Footer";
import { botEmotionManager } from "../components/AIBot/BotEmotionManager";

// Agent output format metadata definitions
const AGENT_OUTPUT_TYPES = {
  ideaValidation: { format: "Executive Summary & Feasibility Metric", type: "Report" },
  marketResearch: { format: "TAM / SAM Breakdown & CAGR Projections", type: "Analytics" },
  competitorAnalysis: { format: "Competitive Moat & Position Matrix", type: "Report" },
  financialPlanning: { format: "3-Year P&L, CAC & LTV Forecast", type: "Financial Model" },
  pitchDeck: { format: "10-Slide Investor Pitch Outline & Script", type: "Pitch Deck" },
  goToMarket: { format: "Channel Matrix & Launch Timeline", type: "Strategy" },
  productRoadmap: { format: "Feature Matrix & Sprint Milestones", type: "Product Plan" },
  riskAssessment: { format: "Risk Mitigation & Regulatory Audit", type: "Matrix" },
  brandingIdentity: { format: "Brand Voice, Positioning & Tagline", type: "Brand Guide" },
  legalCompliance: { format: "Corporate Structuring & IP Checklist", type: "Legal Checklist" },
};

export default function AgentSelectionPage({ go, user }) {
  const { dark } = useTheme();

  // Selected agent keys state (default: all 10 selected)
  const [selectedKeys, setSelectedKeys] = useState(() => {
    return AGENTS.map((a) => a.key);
  });

  // Get intake data preview
  const intakeData = React.useMemo(() => {
    const saved = localStorage.getItem("startup_intake");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const singleIdea = localStorage.getItem("startup_idea");
    if (singleIdea) {
      return { idea: singleIdea, industry: "SaaS / B2B" };
    }
    return null;
  }, []);

  React.useEffect(() => {
    if (!intakeData || !intakeData.idea) {
      go("questions");
    }
  }, [intakeData, go]);

  const safeIdea = intakeData?.idea || "";

  const toggleAgent = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => {
    if (selectedKeys.length === AGENTS.length) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(AGENTS.map((a) => a.key));
    }
  };

  const handleRunAgents = () => {
    if (selectedKeys.length === 0) return;
    botEmotionManager.setEmotion("thinking", 5000);
    localStorage.setItem("selected_agent_keys", JSON.stringify(selectedKeys));
    go("results");
  };

  return (
    <div className="flex flex-col min-h-screen font-body text-text bg-transparent relative">
      <div className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-8 animate-fadeUp text-left">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => go("questions")}
            className="flex items-center gap-1.5 text-xs font-bold text-textMuted hover:text-text cursor-pointer border-none bg-transparent outline-none"
          >
            <ChevronLeft size={16} /> Back to Idea Intake
          </button>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              STEP 2 OF 3 · AGENT SELECTION
            </span>
          </div>
        </div>

        {/* Top Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="font-syne text-3xl font-black text-text">
              Assemble Your AI Specialist Team
            </h1>
            <p className="text-xs sm:text-sm text-textMuted max-w-2xl leading-relaxed font-body">
              Select which AI specialists should analyze <strong className="text-text">"{safeIdea}"</strong>. Click tiles or matrix nodes to select/deselect modules.
            </p>
          </div>

          {/* Quick Selection Shortcuts & Run CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-surface border border-border text-text hover:bg-surfaceAlt transition-all cursor-pointer shadow-xs"
            >
              {selectedKeys.length === AGENTS.length ? <CheckSquare size={14} className="text-cyan-400" /> : <Square size={14} />}
              {selectedKeys.length === AGENTS.length ? "Deselect All" : "Select All 10"}
            </button>

            <button
              onClick={handleRunAgents}
              disabled={selectedKeys.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none cursor-pointer shadow-cyber-cyan transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Rocket size={15} /> Run {selectedKeys.length} Selected Agent{selectedKeys.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>

        {/* Neural Agent Selection Matrix Component */}
        <div className="space-y-4">
          <NeuralAgentMatrix
            compact={false}
            selectable={true}
            selectedKeys={selectedKeys}
            onSelectAgent={(key) => toggleAgent(key)}
          />
        </div>

        {/* Selected Roster Summary Bar */}
        <div className="bento-card p-6 rounded-3xl border border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              {selectedKeys.length} / 10 MODULES SELECTED
            </span>
            <span className="text-xs text-textMuted font-mono">
              {selectedKeys.length === 0 ? "Select at least 1 agent module to proceed." : "Ready to execute concurrent swarm."}
            </span>
          </div>

          <button
            onClick={handleRunAgents}
            disabled={selectedKeys.length === 0}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none cursor-pointer shadow-cyber-cyan transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Run {selectedKeys.length} Selected Agent{selectedKeys.length === 1 ? "" : "s"} <ArrowRight size={15} />
          </button>
        </div>

      </div>

      <Footer go={go} />
    </div>
  );
}
