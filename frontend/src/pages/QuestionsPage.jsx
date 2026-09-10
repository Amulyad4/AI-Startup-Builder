import React, { useState, useEffect } from "react";
import { Rocket, Sparkles, AlertCircle, Compass, Target, Users, ArrowRight } from "lucide-react";
import WorkspaceLayout from "../components/WorkspaceLayout";
import { useTheme } from "../context/ThemeContext";
import { botEmotionManager } from "../components/AIBot/BotEmotionManager";
import { AGENTS } from "../constants";

export default function QuestionsPage({ go, user, setUser }) {
  const { dark } = useTheme();
  
  const [startupIdea, setStartupIdea] = useState(() => {
    return localStorage.getItem("startup_idea") || "";
  });
  const [problem, setProblem] = useState("");
  const [audience, setAudience] = useState("");
  const [industry, setIndustry] = useState("SaaS / B2B");

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem("startup_idea", startupIdea);
    if (startupIdea.length > 90) {
      botEmotionManager.setEmotion("surprised", 4000);
    }
  }, [startupIdea]);

  const handleGenerateBlueprint = () => {
    setErrorMsg("");

    if (!startupIdea || !startupIdea.trim()) {
      setErrorMsg("Please describe your Startup Idea to generate the blueprint.");
      botEmotionManager.setEmotion("concerned", 5000);
      return;
    }

    setIsSubmitting(true);
    botEmotionManager.setEmotion("encouraging", 4000);
    localStorage.setItem("startup_intake", JSON.stringify({
      idea: startupIdea.trim(),
      problem: problem.trim(),
      audience: audience.trim(),
      industry: industry
    }));
    // All 10 agents are active by default
    localStorage.setItem("selected_agent_keys", JSON.stringify(AGENTS.map((a) => a.key)));
    
    setTimeout(() => {
      go("results");
    }, 250);
  };

  return (
    <WorkspaceLayout
      go={go}
      user={user}
      setUser={setUser}
      currentKey="questions"
      title="IDEA INTAKE"
    >
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6 animate-fadeUp text-left">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold uppercase border border-cyan-500/20 shadow-xs">
            <Sparkles size={13} />
            <span>CONCEPT INTAKE · 10 SPECIALIST AGENTS</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-text">
            Describe Your Startup Concept
          </h1>
          <p className="text-xs sm:text-sm text-textMuted max-w-xl mx-auto leading-relaxed">
            Enter your idea context below. All 10 specialized AI agents will autonomously generate your complete investor blueprint.
          </p>
        </div>

        {/* Main Intake Card */}
        <div className="bento-card p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-xl relative overflow-hidden space-y-6 text-left">
          
          {/* Error Notification */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-3 animate-fadeUp">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Concept Required</p>
                <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Primary Input: Startup Idea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text flex items-center gap-2">
                <Sparkles size={15} className="text-cyan-400" /> Startup Concept & Idea Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-mono text-textMuted">
                {startupIdea.length} chars
              </span>
            </div>

            <textarea
              autoFocus
              rows={5}
              value={startupIdea}
              onChange={(e) => {
                setStartupIdea(e.target.value);
                setErrorMsg("");
              }}
              placeholder="e.g. An AI-powered direct-to-consumer supply chain platform that connects local organic farmers directly with urban restaurants, eliminating distributor markups..."
              className="w-full p-4 rounded-2xl border border-border outline-none text-xs sm:text-sm bg-surfaceAlt transition-all text-text leading-relaxed placeholder:text-textMuted/50 focus:border-cyan-400 font-body"
            />
            <p className="text-xs text-textMuted">
              Describe your idea in prose. All 10 specialized AI agents will analyze your market, financials, risk matrix, and pitch deck.
            </p>
          </div>

          {/* Optional Inputs */}
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text flex items-center gap-1.5">
                <Target size={13} className="text-cyan-400" /> Key Problem (Optional)
              </label>
              <input
                type="text"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. High middleman fees and delivery delays"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border outline-none text-xs bg-surfaceAlt text-text focus:border-cyan-400 transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text flex items-center gap-1.5">
                <Users size={13} className="text-purple-400" /> Target Audience (Optional)
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Urban restaurant owners & organic suppliers"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border outline-none text-xs bg-surfaceAlt text-text focus:border-cyan-400 transition-all font-medium"
              />
            </div>
          </div>

          {/* Industry Sector Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text flex items-center gap-1.5">
              <Compass size={13} className="text-cyan-400" /> Industry Sector
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "SaaS / B2B",
                "FoodTech",
                "FinTech",
                "HealthTech",
                "EdTech",
                "E-commerce",
                "Climate / GreenTech",
                "Other",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIndustry(opt)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer outline-none ${
                    industry === opt
                      ? "text-white border-transparent bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-xs font-bold"
                      : "text-textMuted border-border bg-surfaceAlt hover:text-text hover:border-cyan-500/40"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setStartupIdea("");
                setProblem("");
                setAudience("");
                setErrorMsg("");
              }}
              className="px-4 py-2 rounded-xl border border-border text-xs font-bold bg-surface text-textMuted hover:text-text hover:bg-surfaceAlt outline-none cursor-pointer"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleGenerateBlueprint}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-cyber-cyan bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none cursor-pointer hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <Rocket size={16} /> Generate 10-Agent Blueprint <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </WorkspaceLayout>
  );
}
