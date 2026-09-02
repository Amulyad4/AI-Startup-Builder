import React, { useState } from "react";
import { Sparkles, Activity, Check, Cpu, ArrowRight, Shield, Terminal, Zap } from "lucide-react";
import { AGENTS, getAgentColor } from "../constants";
import { useTheme } from "../context/ThemeContext";

export default function NeuralAgentMatrix({
  compact = false,
  selectable = false,
  selectedKeys = null,
  activeStates = null,
  onSelectAgent = null,
}) {
  const { dark } = useTheme();
  const [hoveredKey, setHoveredKey] = useState(null);

  const handleAgentClick = (key) => {
    if (onSelectAgent) {
      onSelectAgent(key);
    }
  };

  return (
    <div className="w-full space-y-4 font-body select-none">
      {/* Top Telemetry Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-surface/80 border border-border backdrop-blur-md font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06B6D4]" />
          <span className="font-bold text-text uppercase tracking-wider">
            {selectable ? "NEURAL ROSTER SELECTOR" : "10-AGENT CONCURRENT SWARM MATRIX"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-textMuted">
          <span>Latency: <strong className="text-emerald-400">12ms</strong></span>
          <span>Status: <strong className="text-cyan-400">100% Operational</strong></span>
        </div>
      </div>

      {/* 10 Agent Neural Matrix Cards Grid */}
      <div className={`grid gap-3.5 ${
        compact 
          ? "grid-cols-2 sm:grid-cols-5" 
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
      }`}>
        {AGENTS.map((agent, idx) => {
          const Icon = agent.icon;
          const agentColor = getAgentColor(agent.key, dark);
          const isSelected = selectedKeys ? selectedKeys.includes(agent.key) : true;
          const isHovered = hoveredKey === agent.key;
          const statusInfo = activeStates?.[agent.key] || { status: "complete", latency: "280ms" };

          return (
            <div
              key={agent.key}
              onMouseEnter={() => setHoveredKey(agent.key)}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => handleAgentClick(agent.key)}
              className={`bento-card p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                isSelected
                  ? "bg-surface border-border hover:border-cyan-400 shadow-cyber-cyan"
                  : "bg-surface/40 border-border opacity-50 hover:opacity-100"
              }`}
              style={{
                borderTop: isSelected ? `3px solid ${agentColor}` : "1px solid var(--border)",
              }}
            >
              <div>
                {/* Header Row: Icon + Checkbox or Status LED */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs"
                    style={{
                      backgroundColor: `${agentColor}18`,
                      color: agentColor
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  {selectable ? (
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-cyan-500 border-cyan-400 text-white shadow-[0_0_10px_#06B6D4]"
                          : "border-border bg-bgSoft text-transparent"
                      }`}
                    >
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  ) : (
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
                    </span>
                  )}
                </div>

                {/* Agent Tag & Name */}
                <span className="font-mono text-[10px] font-bold block mb-0.5" style={{ color: agentColor }}>
                  {agent.tag}
                </span>
                <h4 className="font-display font-bold text-xs text-text truncate group-hover:text-cyan-400 transition-colors">
                  {agent.name}
                </h4>
                <p className="text-[11px] text-textMuted line-clamp-2 mt-1 leading-snug">
                  {agent.desc}
                </p>
              </div>

              {/* Data Throughput Meter Line */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between font-mono text-[9.5px]">
                <span className="text-textMuted">Data Stream:</span>
                <span className="font-bold text-emerald-400">100% Validated</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
