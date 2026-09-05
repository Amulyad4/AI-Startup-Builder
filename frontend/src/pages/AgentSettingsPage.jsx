import React, { useState } from "react";
import { 
  Settings, Check, Cpu, LayoutDashboard, Key, Bell, Shield, Trash2, LogOut, ChevronRight
} from "lucide-react";
import { AGENTS, getAgentColor } from "../constants";
import { useTheme } from "../context/ThemeContext";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";

export default function AgentSettingsPage({ go, user, setUser }) {
  const { dark } = useTheme();

  // Settings State
  const [exportFormat, setExportFormat] = useState("txt");
  const [notifyAlerts, setNotifyAlerts] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearCache = () => {
    localStorage.removeItem("startup_intake");
    localStorage.removeItem("startup_idea");
    localStorage.removeItem("selected_agent_keys");
    alert("Local workspace cache cleared.");
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
            <Settings size={14} className="text-primary" /> WORKSPACE SETTINGS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => go("questions")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-indigo-600 border-none cursor-pointer shadow-xs hover:shadow-primary/30 transition-all"
          >
            Idea Intake
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 relative z-10 space-y-8 animate-fadeUp text-left">
        
        <div className="border-b border-border pb-4 space-y-1">
          <h1 className="font-display text-3xl font-black text-text flex items-center gap-3">
            <Settings size={28} className="text-primary" /> Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
            Manage account defaults, theme options, export preferences, and read-only agent roster specs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Settings Panel (Spans 2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Safe Preferences Card */}
            <div className="bento-card p-6 sm:p-8 rounded-3xl border border-border bg-surface space-y-6 shadow-xs">
              <h3 className="font-display font-bold text-base text-text flex items-center gap-2 border-b border-border pb-4">
                <Settings size={18} className="text-primary" /> General Workspace Defaults
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="font-display font-bold text-sm text-text">Default Report Export Format</h4>
                    <p className="text-xs text-textMuted">Choose default format for exported blueprints</p>
                  </div>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-border bg-bgSoft text-xs font-mono font-bold text-text outline-none"
                  >
                    <option value="txt">Formatted Text (.txt)</option>
                    <option value="md">Markdown Document (.md)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="font-display font-bold text-sm text-text">Auto-Save Generated Reports</h4>
                    <p className="text-xs text-textMuted">Automatically cache execution history in browser storage</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <h4 className="font-display font-bold text-sm text-text">Swarm Completion Notifications</h4>
                    <p className="text-xs text-textMuted">Display alerts when execution finishes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyAlerts}
                    onChange={(e) => setNotifyAlerts(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-display font-bold text-sm text-text">Application Theme</h4>
                    <p className="text-xs text-textMuted">Toggle between Light and Dark mode</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-primary border-none cursor-pointer shadow-xs"
                >
                  {savedSuccess ? <Check size={14} /> : null}
                  {savedSuccess ? "Saved Successfully" : "Save Preferences"}
                </button>
              </div>
            </div>

            {/* Read-Only Agent Roster Specifications */}
            <div className="bento-card p-6 sm:p-8 rounded-3xl border border-border bg-surface space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display font-bold text-base text-text flex items-center gap-2">
                    <Cpu size={18} className="text-primary" /> Specialist Agent Directory (Read-Only)
                  </h3>
                  <p className="text-xs text-textMuted mt-0.5">
                    10 developer-configured specialist modules (backend-driven).
                  </p>
                </div>
                <span className="font-mono text-[10px] font-bold text-primary bg-primarySoft px-2.5 py-1 rounded-full border border-primary/20">
                  FIXED ROSTER
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {AGENTS.map((a) => {
                  const Icon = a.icon;
                  const agentColor = getAgentColor(a.key, dark);
                  return (
                    <div key={a.key} className="p-3.5 rounded-2xl bg-bgSoft border border-border space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{ backgroundColor: `${agentColor}18`, color: agentColor }}>
                          <Icon size={14} />
                        </div>
                        <span className="font-mono text-[10px] font-bold" style={{ color: agentColor }}>{a.tag}</span>
                      </div>
                      <h4 className="font-display font-bold text-xs text-text">{a.name}</h4>
                      <p className="text-[11px] text-textMuted leading-tight line-clamp-2">{a.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DANGER ZONE PANEL */}
            <div className="bento-card p-6 rounded-3xl border border-rose-500/40 bg-rose-500/5 space-y-4 shadow-xs">
              <h3 className="font-display font-bold text-sm text-rose-500 flex items-center gap-2">
                <Trash2 size={16} /> Danger Zone
              </h3>
              <p className="text-xs text-textMuted leading-relaxed">
                Actions here will clear locally cached idea submissions and workspace settings.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-rose-500/20">
                <button
                  onClick={handleClearCache}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-500 border border-rose-500/40 bg-surface hover:bg-rose-500/10 cursor-pointer outline-none transition-colors"
                >
                  <Trash2 size={13} /> Clear Workspace Cache
                </button>

                <button
                  onClick={() => {
                    setUser(null);
                    go("landing");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-text border border-border bg-surface hover:bg-surfaceAlt cursor-pointer outline-none transition-colors"
                >
                  <LogOut size={13} /> Sign Out of Account
                </button>
              </div>
            </div>

          </div>

          {/* Right Sidebar Info */}
          <div className="space-y-6">
            <div className="bento-card p-6 rounded-3xl border border-border bg-surface space-y-4">
              <h3 className="font-display font-bold text-sm text-text flex items-center gap-2">
                <Shield size={16} className="text-primary" /> Workspace System Info
              </h3>
              <div className="space-y-2 font-mono text-xs text-textMuted">
                <div className="flex justify-between">
                  <span>Version</span>
                  <strong className="text-text">Swarm OS v2.4</strong>
                </div>
                <div className="flex justify-between">
                  <span>Specialists</span>
                  <strong className="text-emerald-500">10 Modules Online</strong>
                </div>
                <div className="flex justify-between">
                  <span>Storage</span>
                  <strong className="text-primary">Local Storage Caching</strong>
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
