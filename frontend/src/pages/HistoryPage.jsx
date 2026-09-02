import React from "react";
import { 
  History, Bookmark, ArrowRight, Download, Calendar, Layers,
  ChevronRight, Sparkles, CheckCircle2, Shield
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import { generateDynamicAgentReports } from "../services/agentEngine";

export default function HistoryPage({ go, user }) {
  const { dark } = useTheme();

  const [historyList, setHistoryList] = React.useState(() => {
    const saved = localStorage.getItem("startup_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const handleReopenThread = (item) => {
    if (item?.intakeData) {
      localStorage.setItem("startup_intake", JSON.stringify(item.intakeData));
      if (item.intakeData.idea) {
        localStorage.setItem("startup_idea", item.intakeData.idea);
      }
    }
    go("results");
  };

  const handleDeleteItem = (id) => {
    const updated = historyList.filter(item => item.id !== id);
    setHistoryList(updated);
    localStorage.setItem("startup_history", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all blueprint history?")) {
      setHistoryList([]);
      localStorage.removeItem("startup_history");
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-text font-body flex flex-col relative overflow-x-hidden">
      
      {/* Background Dot Texture */}
      <div className="absolute inset-0 bg-dot-texture opacity-15 pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button onClick={() => go("landing")} className="cursor-pointer border-none bg-transparent outline-none">
            <Logo />
          </button>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <span className="font-mono text-xs text-textMuted hidden sm:flex items-center gap-1.5 font-bold">
            <History size={14} className="text-primary" /> PAST SUBMISSIONS HISTORY
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => go("questions")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-indigo-600 border-none cursor-pointer shadow-xs hover:shadow-primary/30 transition-all"
          >
            New Idea Intake
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 relative z-10 space-y-8 animate-fadeUp text-left">
        
        <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-black text-text flex items-center gap-3">
              <History size={28} className="text-primary" /> Execution History & Saved Blueprints
            </h1>
            <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
              Reopen previous startup idea executions directly into the interactive Results Thread or export saved reports.
            </p>
          </div>

          {historyList.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-rose-500 border border-rose-500/30 px-3 py-1.5 rounded-xl bg-surface hover:bg-rose-500/10 cursor-pointer outline-none transition-all self-start sm:self-auto"
            >
              Clear All History
            </button>
          )}
        </div>

        {historyList.length === 0 ? (
          <div className="bento-card p-12 rounded-3xl border border-border bg-surface text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-primarySoft text-primary mx-auto flex items-center justify-center">
              <History size={32} />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-display font-bold text-xl text-text">No Saved Blueprints Yet</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                When you run the AI specialist agents on your startup ideas, your generated blueprints and pitch decks will be saved here for easy access.
              </p>
            </div>
            <button
              onClick={() => go("questions")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-indigo-600 border-none cursor-pointer shadow-xs hover:shadow-primary/30 transition-all"
            >
              Start New Idea Intake <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {historyList.map((item) => (
              <div
                key={item.id}
                className="bento-card p-6 rounded-3xl border border-border bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-primary/60 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold bg-primarySoft text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                      {item.industry || "SaaS / B2B"}
                    </span>
                    {item.feasibility && (
                      <span className="font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        Fit Score {item.feasibility}
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-textMuted flex items-center gap-1">
                      <Calendar size={11} /> {item.date || "Recently"}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-text">
                    {item.title}
                  </h3>
                  <p className="text-xs text-textMuted font-mono">
                    Agents Run: <strong className="text-text font-bold">{item.agentsRunCount || 10} / 10 Specialists</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 rounded-xl text-xs text-textMuted hover:text-rose-500 border border-border hover:border-rose-500/30 bg-surfaceAlt transition-all cursor-pointer"
                    title="Remove from history"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleReopenThread(item)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary border-none cursor-pointer shadow-xs hover:shadow-primary/30 transition-all"
                  >
                    Reopen Results Thread <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <Footer go={go} />
    </div>
  );
}
