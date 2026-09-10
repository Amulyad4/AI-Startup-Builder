import React, { useState } from "react";
import { 
  Bot, Sparkles, CheckSquare, Square, Rocket, ArrowRight,
  ChevronLeft
} from "lucide-react";
import { AGENTS } from "../constants";
import { useTheme } from "../context/ThemeContext";
import WorkspaceLayout from "../components/WorkspaceLayout";
import NeuralAgentMatrix from "../components/NeuralAgentMatrix";
import { botEmotionManager } from "../components/AIBot/BotEmotionManager";

export default function AgentSelectionPage({ go, user, setUser }) {
  const { dark } = useTheme();

  // Selected agent keys state (default: all 10 selected)
  const [selectedKeys, setSelectedKeys] = useState(() => {
    return AGENTS.map((a) => a.key);
  });

  // Get intake data preview
  const intakeData = React.useMemo(() => {
    const saved = localStorage.getItem("startup_intake");
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed && parsed.idea) return parsed;
      } catch (e) {}
    }
    const singleIdea = localStorage.getItem("startup_idea");
    if (singleIdea) {
      return { idea: singleIdea, industry: "SaaS / B2B" };
    }
    return { idea: "Autonomous AI Agent Orchestration Platform for Founders", industry: "SaaS / B2B" };
  }, []);

  const safeIdea = intakeData?.idea || "Your Startup Concept";

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
    <WorkspaceLayout
      go={go}
      user={user}
      setUser={setUser}
      currentKey="select"
      title="AGENT SELECTION"
    >
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 animate-fadeUp text-left">
        
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
              STEP 2 OF 2 · AGENT SELECTION
            </span>
          </div>
        </div>

        {/* Top Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="font-syne text-2xl sm:text-3xl font-black text-text">
              Assemble Your AI Specialist Team
            </h1>
            <p className="text-xs sm:text-sm text-textMuted max-w-2xl leading-relaxed font-body">
              Select which AI specialists should analyze <strong className="text-text">"{safeIdea}"</strong>. Click tiles or matrix nodes to toggle modules.
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none cursor-pointer shadow-cyber-cyan transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
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
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none cursor-pointer shadow-cyber-cyan transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            Run {selectedKeys.length} Selected Agent{selectedKeys.length === 1 ? "" : "s"} <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </WorkspaceLayout>
  );
}
