import React, { useState } from "react";
import { 
  User, Mail, Shield, Key, Award, Clock, FileText, CheckCircle2, 
  Settings, LogOut, ChevronRight, Sparkles, Cpu, Activity, Database, KeyRound, ExternalLink
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";

export default function ProfilePage({ go, user, setUser }) {
  const { dark } = useTheme();

  const [activeTab, setActiveTab] = useState("overview");

  // Load real history
  const recentActivities = React.useMemo(() => {
    const saved = localStorage.getItem("startup_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  }, []);

  const totalRuns = recentActivities.reduce((acc, a) => acc + (a.agentsRunCount || 10), 0);
  const timeSaved = (recentActivities.length * 3.5).toFixed(1);

  const avgFeasibility = React.useMemo(() => {
    if (recentActivities.length === 0) return "N/A";
    const scores = recentActivities
      .map(a => parseFloat(a.feasibility))
      .filter(n => !isNaN(n));
    if (scores.length === 0) return "9.4 / 10";
    const sum = scores.reduce((a, b) => a + b, 0);
    return (sum / scores.length).toFixed(1) + " / 10";
  }, [recentActivities]);

  return (
    <div className="min-h-screen bg-transparent text-text font-body flex flex-col relative overflow-x-hidden">
      
      {/* Background Dot Texture */}
      <div className="absolute inset-0 bg-dot-texture opacity-15 pointer-events-none z-0" />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button onClick={() => go("landing")} className="cursor-pointer border-none bg-transparent outline-none">
            <Logo />
          </button>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <span className="font-mono text-xs text-textMuted hidden sm:flex items-center gap-1.5 font-bold">
            <User size={14} className="text-cyan-400" /> FOUNDER COMMAND CENTER
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => go("questions")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none cursor-pointer shadow-cyber-cyan hover:scale-[1.02] transition-all"
          >
            Start Idea Intake
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 relative z-10 space-y-8 animate-fadeUp text-left">
        
        {/* Founder Hero Header Card */}
        <div className="bento-card p-6 sm:p-8 rounded-3xl border border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg hover:border-cyan-500/50 transition-all">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            
            {/* Avatar Circle */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-display font-extrabold text-3xl shadow-cyber-cyan shrink-0">
              {(user?.name || "F").charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text">
                  {user?.name || "Founder Workspace"}
                </h1>
                <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  PRO FOUNDER TIER
                </span>
              </div>
              <p className="text-xs text-textMuted font-mono flex items-center justify-center sm:justify-start gap-1.5">
                <Mail size={13} className="text-cyan-400" /> {user?.email || "founder@startup.com"}
              </p>
              <p className="text-[11px] text-textMuted font-mono">
                Active Workspace · <strong className="text-text">AI Specialist Engine Online</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => go("settings")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-surfaceAlt border border-border text-text hover:bg-border transition-all cursor-pointer shadow-xs"
            >
              <Settings size={14} /> Workspace Settings
            </button>

            <button
              onClick={() => {
                setUser(null);
                go("landing");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 border border-rose-500/30 bg-surface hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* 4 KEY STAT FLASHCARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Blueprints Generated", value: `${recentActivities.length} Blueprint${recentActivities.length === 1 ? '' : 's'}`, color: "#06B6D4", icon: FileText },
            { label: "Specialists Executed", value: `${totalRuns} Swarm Runs`, color: "#6366F1", icon: Cpu },
            { label: "Estimated Time Saved", value: `${timeSaved} Hours`, color: "#10B981", icon: Clock },
            { label: "Avg Feasibility Score", value: avgFeasibility, color: "#A855F7", icon: Award },
          ].map((stat, sIdx) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={sIdx}
                className="bento-card p-5 rounded-3xl border border-border bg-surface space-y-2 shadow-xs hover:border-cyan-500/50 hover:shadow-cyber-cyan transition-all"
              >
                <div className="flex items-center justify-between text-textMuted">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                  <StatIcon size={16} style={{ color: stat.color }} />
                </div>
                <span className="font-display font-extrabold text-xl sm:text-2xl text-text block">
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* RECENT BLUEPRINT HISTORY & INTEGRATIONS */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Activity Timeline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bento-card p-6 rounded-3xl border border-border bg-surface space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="font-display font-bold text-base text-text flex items-center gap-2">
                  <Activity size={18} className="text-cyan-400" /> Recent AI Blueprint Runs
                </h3>
                <button
                  onClick={() => go("history")}
                  className="font-mono text-xs font-bold text-cyan-400 hover:underline border-none bg-transparent cursor-pointer"
                >
                  View All History →
                </button>
              </div>

              {recentActivities.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <p className="text-xs text-textMuted">No blueprint activity recorded yet.</p>
                  <button
                    onClick={() => go("questions")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary border-none cursor-pointer"
                  >
                    Start First Idea Intake →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.slice(0, 5).map((act, aIdx) => (
                    <div
                      key={act.id || aIdx}
                      onClick={() => {
                        if (act.intakeData) {
                          localStorage.setItem("startup_intake", JSON.stringify(act.intakeData));
                          if (act.intakeData.idea) localStorage.setItem("startup_idea", act.intakeData.idea);
                        }
                        go("results");
                      }}
                      className="p-4 rounded-2xl bg-surfaceAlt border border-border hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-sm text-text group-hover:text-cyan-400 transition-colors">
                          "{act.title}"
                        </h4>
                        <p className="text-[11px] text-textMuted font-mono">
                          Executed {act.agentsRunCount || 10} Agents · {act.date || "Recently"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {act.feasibility && (
                          <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Feasibility: {act.feasibility}
                          </span>
                        )}
                        <ChevronRight size={16} className="text-textMuted group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Workspace Integrations */}
          <div className="space-y-4">
            <div className="bento-card p-6 rounded-3xl border border-border bg-surface space-y-4 shadow-xs">
              <h3 className="font-display font-bold text-base text-text flex items-center gap-2 border-b border-border pb-4">
                <Database size={18} className="text-cyan-400" /> Workspace Status
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-bg border border-border space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-textMuted text-[10px]">SUPABASE DATABASE</span>
                    <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">● CONNECTED</span>
                  </div>
                  <p className="font-bold text-text text-[11px]">PostgreSQL Vector Cache</p>
                </div>

                <div className="p-3 rounded-2xl bg-bg border border-border space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-textMuted text-[10px]">SWARM ENGINE</span>
                    <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">10 ONLINE</span>
                  </div>
                  <p className="font-bold text-text text-[11px]">LangGraph Orchestrator</p>
                </div>

                <div className="p-3 rounded-2xl bg-bg border border-border space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-textMuted text-[10px]">EXPORT FORMAT</span>
                    <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">TXT / MD</span>
                  </div>
                  <p className="font-bold text-text text-[11px]">Formatted Text & Deck</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <Footer go={go} />
    </div>
  );
}
