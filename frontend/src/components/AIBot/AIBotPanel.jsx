import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, Lightbulb, Search, BarChart3, Target, DollarSign, Rocket, AlertTriangle, Check, ArrowRight, Settings, RotateCcw, MessageSquare, Compass, Shield, Zap, ChevronRight
} from "lucide-react";
import AIBotMascot from "./AIBotMascot";
import { EMOTION_LABELS, botEmotionManager } from "./BotEmotionManager";
import { handleQuickAction } from "./BotTipsEngine";

const QUICK_ACTIONS = [
  { id: "give_idea", label: "Give me an idea", icon: Lightbulb, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "improve_concept", label: "Improve my concept", icon: Search, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { id: "analyze_market", label: "Analyze my market", icon: BarChart3, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  { id: "target_audience", label: "Define target audience", icon: Target, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "business_model", label: "Help with business model", icon: DollarSign, color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
  { id: "next_steps", label: "What should I do next?", icon: Rocket, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { id: "find_weaknesses", label: "Find weaknesses", icon: AlertTriangle, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  { id: "pro_tip", label: "Give me a pro tip", icon: Sparkles, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
];

const TOUR_STEPS = [
  {
    step: 1,
    title: "Stage 1: Startup Concept Intake",
    desc: "Describe your startup idea, core problem, target audience, and industry sector in plain prose.",
    tip: "Be as descriptive as you like — CYRA-1 and the 10 specialist agents handle the heavy lifting!"
  },
  {
    step: 2,
    title: "Stage 2: Assemble Your AI Specialist Team",
    desc: "Select which specialist agents to include in your analysis. Select all 10 agents for a full blueprint or pick key modules.",
    tip: "Click any matrix node to toggle agents on or off."
  },
  {
    step: 3,
    title: "Stage 3: Swarm Execution & Results",
    desc: "Inspect synthesized outputs: TAM/SAM figures, 10-slide Pitch Deck outlines, Financial forecasts, and Terminal logs.",
    tip: "Click 'Export Blueprint' at the top right of the dashboard to download your complete report!"
  }
];

export default function AIBotPanel({
  onClose,
  currentRoute,
  intakeData = {},
  go = null,
  proactiveTipsEnabled = true,
  setProactiveTipsEnabled = () => {}
}) {
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "actions" | "tour" | "settings"
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      title: "👋 Hello Founder!",
      text: "I'm **CYRA-1**, your AI Co-Founder mascot. I'm here to guide you, analyze your market, refine your business model, and celebrate your milestones!",
      emotion: "happy"
    }
  ]);
  const [tourIdx, setTourIdx] = useState(0);

  const currentEmotion = botEmotionManager.getEmotion();
  const emotionMeta = EMOTION_LABELS[currentEmotion] || EMOTION_LABELS.idle;

  const handleRunQuickAction = (actionId) => {
    const res = handleQuickAction(actionId, intakeData);
    botEmotionManager.setEmotion(res.emotion, 6000);

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        title: res.title,
        text: res.text,
        emotion: res.emotion,
        action: res.action
      }
    ]);
    setActiveTab("chat");
  };

  const handleActionClick = (actionType) => {
    if (actionType === "preset" && go) {
      go("questions");
    } else if (actionType === "proceed" && go) {
      if (currentRoute === "questions") go("select");
      else if (currentRoute === "select") go("results");
      else go("questions");
    } else if (actionType === "run_agents" && go) {
      go("select");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-4 bottom-24 sm:inset-auto sm:bottom-28 sm:right-6 sm:w-[460px] max-w-[calc(100vw-2.5rem)] bg-surface border border-border p-5 rounded-3xl shadow-2xl z-50 text-left space-y-4 backdrop-blur-2xl max-h-[82vh] overflow-y-auto font-body"
    >
      {/* PANEL HEADER BAR */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 shrink-0">
            <AIBotMascot emotion={currentEmotion} size={44} showEmotePicker={false} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-text">
                CYRA-1 AI Co-Founder
              </h3>
              <span className="font-mono text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {emotionMeta.icon} {currentEmotion.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-textMuted font-mono">
              Intelligent Startup Companion
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-textMuted hover:text-text cursor-pointer border border-border p-1.5 rounded-xl bg-surfaceAlt hover:bg-border transition-colors outline-none"
          title="Minimize Assistant"
        >
          <X size={16} />
        </button>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1 p-1 bg-surfaceAlt rounded-xl border border-border font-mono text-xs">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold transition-all cursor-pointer ${
            activeTab === "chat" ? "bg-primary text-white shadow-xs" : "text-textMuted hover:text-text"
          }`}
        >
          💬 Chat & Advice
        </button>
        <button
          onClick={() => setActiveTab("actions")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold transition-all cursor-pointer ${
            activeTab === "actions" ? "bg-primary text-white shadow-xs" : "text-textMuted hover:text-text"
          }`}
        >
          ⚡ Actions
        </button>
        <button
          onClick={() => setActiveTab("tour")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold transition-all cursor-pointer ${
            activeTab === "tour" ? "bg-primary text-white shadow-xs" : "text-textMuted hover:text-text"
          }`}
        >
          🚀 Guided Tour
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`p-1.5 rounded-lg text-center transition-all cursor-pointer ${
            activeTab === "settings" ? "bg-primary text-white shadow-xs" : "text-textMuted hover:text-text"
          }`}
          title="Bot Settings"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* TAB 1: CHAT & ADVICE */}
      {activeTab === "chat" && (
        <div className="space-y-3">
          {/* Chat Messages Log */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-surfaceAlt/80 border border-border space-y-1.5 text-xs text-text leading-relaxed"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 font-display flex items-center gap-1.5 text-xs">
                    <Sparkles size={13} /> {msg.title}
                  </span>
                  <span className="font-mono text-[9px] text-textMuted">
                    {msg.emotion}
                  </span>
                </div>
                <div className="text-textMuted whitespace-pre-line leading-relaxed font-body">
                  {msg.text}
                </div>
                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action)}
                    className="mt-2 flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline border-none bg-transparent cursor-pointer"
                  >
                    Take Action <ChevronRight size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Action Chips Bar */}
          <div className="pt-2 border-t border-border space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-textMuted uppercase tracking-wider block">
              SUGGESTED QUICK ACTIONS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.slice(0, 4).map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleRunQuickAction(a.id)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-medium border border-border bg-surface hover:bg-surfaceAlt text-text transition-all cursor-pointer"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL QUICK ACTIONS GRID */}
      {activeTab === "actions" && (
        <div className="space-y-2">
          <span className="font-mono text-[10px] font-bold text-textMuted uppercase tracking-wider block">
            SELECT AN AI ASSISTANT ACTION:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((a) => {
              const IconComp = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => handleRunQuickAction(a.id)}
                  className={`p-3 rounded-2xl border ${a.color} flex flex-col items-start gap-1.5 text-left transition-all hover:scale-[1.02] cursor-pointer shadow-xs`}
                >
                  <IconComp size={16} />
                  <span className="text-xs font-bold font-body leading-tight">
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GUIDED TOUR */}
      {activeTab === "tour" && (
        <div className="space-y-4 text-xs font-body">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                STEP {TOUR_STEPS[tourIdx].step} OF 3
              </span>
              <span className="font-bold text-text font-display">
                {TOUR_STEPS[tourIdx].title}
              </span>
            </div>
            <p className="text-textMuted leading-relaxed">
              {TOUR_STEPS[tourIdx].desc}
            </p>
            <div className="p-2.5 rounded-xl bg-surface border border-border text-[11px] text-cyan-300 font-mono">
              💡 {TOUR_STEPS[tourIdx].tip}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === tourIdx ? "w-5 bg-cyan-400" : "bg-border"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {tourIdx > 0 && (
                <button
                  onClick={() => setTourIdx(tourIdx - 1)}
                  className="px-3 py-1.5 rounded-xl bg-surfaceAlt border border-border text-xs font-bold text-text cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (tourIdx < TOUR_STEPS.length - 1) setTourIdx(tourIdx + 1);
                  else setActiveTab("chat");
                }}
                className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer"
              >
                {tourIdx === TOUR_STEPS.length - 1 ? "Done" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BOT SETTINGS */}
      {activeTab === "settings" && (
        <div className="space-y-4 text-xs font-body">
          <div className="p-4 rounded-2xl bg-surfaceAlt border border-border space-y-3">
            <h4 className="font-bold text-text font-display">Mascot & Tip Settings</h4>
            
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-bold text-text">Proactive Tip Bubbles</p>
                <p className="text-[11px] text-textMuted">Show occasional non-intrusive tips</p>
              </div>
              <input
                type="checkbox"
                checked={proactiveTipsEnabled}
                onChange={(e) => setProactiveTipsEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setChatMessages([chatMessages[0]])}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:underline border-none bg-transparent cursor-pointer"
              >
                <RotateCcw size={12} /> Clear Chat Log
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
