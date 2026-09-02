import React, { useState, useEffect } from "react";
import { Rocket, Sparkles, AlertCircle, Bot, Compass, Target, Users, Lightbulb, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";
import { AGENTS, getAgentColor } from "../constants";
import { useTheme } from "../context/ThemeContext";
import { botEmotionManager } from "../components/AIBot/BotEmotionManager";

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

  const handleProceedToSelection = () => {
    setErrorMsg("");

    if (!startupIdea || !startupIdea.trim()) {
      setErrorMsg("Please describe your Startup Idea to proceed to agent selection.");
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
    
    setTimeout(() => {
      go("select");
    }, 250);
  };

  return (
    <div className="flex flex-col min-h-screen font-body text-text relative bg-transparent">
      <div className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full space-y-6">
        
        {/* Header Badge & Title */}
        <div className="text-center animate-fadeUp space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primarySoft text-primary font-mono text-xs font-bold uppercase border border-primary/20 shadow-xs">
            <Sparkles size={13} />
            <span>STEP 1 OF 3 · SINGLE CONCEPT INTAKE</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-text">
            Describe Your Startup Concept
          </h1>
          <p className="text-xs sm:text-sm text-textMuted max-w-xl mx-auto leading-relaxed">
            Enter your idea context below. Next, you will select which AI specialist agents to run on your concept.
          </p>
        </div>

        {/* Main Intake Card */}
        <div className="bento-card p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-xl relative overflow-hidden space-y-6 text-left animate-fadeUp">
          
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
                <Sparkles size={15} className="text-primary" /> Startup Concept & Idea Description <span className="text-rose-500">*</span>
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
              className="w-full p-4 rounded-2xl border border-border outline-none text-xs sm:text-sm bg-bgSoft transition-all text-text leading-relaxed placeholder:text-textMuted/50 focus:border-primary font-body"
            />
            <p className="text-xs text-textMuted">
              Describe your idea in prose. On the next screen, you will pick which agents should execute.
            </p>
          </div>

          {/* Optional Inputs */}
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text flex items-center gap-1.5">
                <Target size={13} className="text-primary" /> Key Problem (Optional)
              </label>
              <input
                type="text"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. High middleman fees and delivery delays"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border outline-none text-xs bg-bgSoft text-text focus:border-primary transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text flex items-center gap-1.5">
                <Users size={13} className="text-accent" /> Target Audience (Optional)
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Urban restaurant owners & organic suppliers"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border outline-none text-xs bg-bgSoft text-text focus:border-primary transition-all font-medium"
              />
            </div>
          </div>

          {/* Industry Sector Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text flex items-center gap-1.5">
              <Compass size={13} className="text-primary" /> Industry Sector
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
                      ? "text-white border-transparent bg-primary shadow-xs font-bold"
                      : "text-textMuted border-border bg-bgSoft hover:text-text hover:border-border-contrast"
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
              onClick={handleProceedToSelection}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-primary/30 bg-gradient-to-r from-primary to-indigo-600 border-none outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              Select AI Specialist Agents <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>

      <Footer go={go} />
    </div>
  );
}
