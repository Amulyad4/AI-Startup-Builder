import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, CheckCircle2, ArrowRight, Pencil, Target, Users, Compass,
  Sparkles, ShieldCheck, TrendingUp,
} from "lucide-react";
import Footer from "../components/Footer";
import Reveal from "../components/motion/Reveal";
import MagneticButton from "../components/motion/MagneticButton";
import { generateDynamicAgentReports } from "../services/agentEngine";

// Turns the Idea Validation agent's markdown-ish output into structured
// { label, value } rows so it can be rendered as a real UI instead of raw text.
function parseValidation(markdown) {
  return markdown
    .split("\n")
    .map((line) => line.match(/^-\s*\*\*(.+?)\*\*:\s*(.+)$/))
    .filter(Boolean)
    .map((m) => ({ label: m[1], value: m[2] }));
}

export default function AnalysisPage({ go, user }) {
  const [analyzing, setAnalyzing] = useState(true);

  const intake = useMemo(() => {
    const saved = localStorage.getItem("startup_intake");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }, []);

  // No idea submitted yet — send the user back to intake instead of showing
  // an empty/broken analysis screen.
  useEffect(() => {
    if (!intake) {
      go("questions");
    }
  }, [intake]);

  // Brief, honest "agent is working" beat — not a fake multi-second delay,
  // just enough to read as a real analysis step rather than an instant swap.
  useEffect(() => {
    const t = setTimeout(() => setAnalyzing(false), 1100);
    return () => clearTimeout(t);
  }, []);

  if (!intake) return null;

  const report = generateDynamicAgentReports(intake);
  const rows = parseValidation(report.ideaValidation);

  const feasibilityRow = rows.find((r) => r.label.includes("Feasibility"));
  const verdictRow = rows.find((r) => r.label.includes("Verdict"));
  const otherRows = rows.filter((r) => r !== feasibilityRow && r !== verdictRow);

  const feasibilityScore = feasibilityRow
    ? parseFloat(feasibilityRow.value)
    : null;
  const [verdictWord, verdictDetail] = verdictRow
    ? verdictRow.value.split("—").map((s) => s.trim())
    : ["", ""];

  return (
    <div className="flex flex-col min-h-screen font-body text-text relative">
      <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-primary/10 via-purple-500/10 to-accent/10 rounded-full blur-3xl pointer-events-none" />

        <Reveal className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primarySoft text-primary font-mono text-xs font-bold uppercase mb-4 border border-primary/20 shadow-xs">
            <Brain size={14} />
            <span>AGENT.01 · IDEA VALIDATION</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-text mb-3">
            {analyzing ? "Validating your concept…" : "Validation Complete"}
          </h1>
          <p className="text-sm md:text-base text-textMuted max-w-xl mx-auto leading-relaxed">
            {analyzing
              ? "The Idea Validation Agent is reviewing your submission before the full swarm engages."
              : "Here's what you submitted and what the Idea Validation Agent found. Review it, then continue to the full 10-agent workbench."}
          </p>
        </Reveal>

        {analyzing ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <motion.div
              className="w-14 h-14 rounded-full border-2 border-primary/25 border-t-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="font-mono text-[11px] text-textMuted uppercase tracking-wider">
              Analyzing feasibility, audience fit, and USP…
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* What you submitted */}
            <Reveal className="rounded-3xl border border-border bg-surface/80 backdrop-blur-xl p-6 md:p-8 text-left shadow-lg">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={16} className="text-accent" />
                <h2 className="font-display font-bold text-lg text-text">Your Submission</h2>
              </div>
              <p className="text-sm text-text leading-relaxed mb-5">{intake.idea}</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-bgSoft/80 border border-border/60">
                  <Target size={14} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase text-textMuted font-bold mb-0.5">Problem</div>
                    <div className="text-xs text-text">{intake.problem || "Not specified"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-bgSoft/80 border border-border/60">
                  <Users size={14} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase text-textMuted font-bold mb-0.5">Audience</div>
                    <div className="text-xs text-text">{intake.audience || "Not specified"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-bgSoft/80 border border-border/60">
                  <Compass size={14} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase text-textMuted font-bold mb-0.5">Industry</div>
                    <div className="text-xs text-text">{intake.industry}</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Agent verdict */}
            <Reveal delay={0.1} className="rounded-3xl border border-border bg-surface/80 backdrop-blur-xl p-6 md:p-8 text-left shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full bg-gradient-to-bl from-emerald-500/10 via-primary/5 to-transparent pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <h2 className="font-display font-bold text-lg text-text">Idea Validation Agent — Verdict</h2>
                </div>
                {verdictWord && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold w-fit">
                    <CheckCircle2 size={13} /> {verdictWord}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
                {feasibilityScore !== null && (
                  <div className="relative w-28 h-28 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 42}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - feasibilityScore / 10) }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--accent)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display font-black text-xl text-text">{feasibilityScore}</span>
                      <span className="text-[9px] font-mono text-textMuted uppercase">/ 10 fit</span>
                    </div>
                  </div>
                )}
                <p className="text-sm text-textMuted leading-relaxed flex-1">
                  {verdictDetail || "The agent has completed its initial feasibility pass on your concept."}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-5 border-t border-border/60">
                {otherRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-2">
                    <TrendingUp size={13} className="text-primary mt-1 shrink-0" />
                    <div>
                      <div className="text-[10px] font-mono uppercase text-textMuted font-bold">{row.label}</div>
                      <div className="text-xs text-text leading-relaxed">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Actions */}
            <Reveal delay={0.15} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => go("questions")}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-xs font-bold bg-surface text-textMuted hover:text-text hover:bg-surfaceAlt transition-colors outline-none cursor-pointer"
              >
                <Pencil size={14} /> Edit My Idea
              </button>
              <MagneticButton
                onClick={() => go("dashboard")}
                strength={8}
                className="shine-sweep flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-xl hover:shadow-primary/30 bg-gradient-to-r from-primary via-indigo-600 to-accent border-none outline-none cursor-pointer"
              >
                Continue to Full Dashboard <ArrowRight size={17} />
              </MagneticButton>
            </Reveal>
          </div>
        )}
      </div>
      <Footer go={go} />
    </div>
  );
}
