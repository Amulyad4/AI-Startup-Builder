import React, { useState } from "react";
import { 
  LayoutDashboard, Rocket, Sliders, MessageSquare, BarChart3, 
  Terminal, Cpu, History, User, Settings, LogOut, Menu, X, 
  Sparkles, Download
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { AGENTS, getAgentColor } from "../constants";
import { useTheme } from "../context/ThemeContext";

export default function WorkspaceLayout({
  children,
  go,
  user,
  setUser,
  currentKey = "dashboard",
  activeTab,
  setActiveTab,
  onExportBlueprint,
  title = "WORKSPACE CONSOLE",
}) {
  const { dark } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Retrieve selected agents list
  const selectedAgentKeys = React.useMemo(() => {
    try {
      const saved = localStorage.getItem("selected_agent_keys");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return AGENTS.map((a) => a.key);
  }, []);

  const selectedAgentsList = AGENTS.filter((a) => selectedAgentKeys.includes(a.key));

  const navItems = [
    {
      group: "MAIN HUB",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
        { id: "questions", label: "Idea Intake", icon: Rocket, path: "questions" },
      ]
    },
    {
      group: "INTELLIGENCE & REPORTS",
      items: [
        { 
          id: "results", 
          label: "Results Thread", 
          icon: MessageSquare, 
          action: () => {
            if (setActiveTab) setActiveTab("results");
            go("results");
          }
        },
        { 
          id: "analytics", 
          label: "Analytics & Graphs", 
          icon: BarChart3, 
          action: () => {
            if (setActiveTab) setActiveTab("analytics");
            go("dashboard");
          }
        },
        { 
          id: "console", 
          label: "Terminal Console", 
          icon: Terminal, 
          action: () => {
            if (setActiveTab) setActiveTab("console");
            go("dashboard");
          }
        },
        { 
          id: "matrix", 
          label: "Swarm Efficiency", 
          icon: Cpu, 
          action: () => {
            if (setActiveTab) setActiveTab("matrix");
            go("dashboard");
          }
        }
      ]
    },
    {
      group: "MANAGEMENT",
      items: [
        { id: "history", label: "Past History", icon: History, path: "history" },
        { id: "profile", label: "Founder Profile", icon: User, path: "profile" },
        { id: "settings", label: "Settings", icon: Settings, path: "settings" }
      ]
    }
  ];

  const handleNavClick = (item) => {
    setMobileSidebarOpen(false);
    if (item.action) {
      item.action();
    } else if (item.path) {
      go(item.path);
    }
  };

  const isItemActive = (item) => {
    if (["results", "analytics", "console", "matrix"].includes(item.id)) {
      if (currentKey === "dashboard" || currentKey === "results") {
        return activeTab === item.id || (!activeTab && item.id === "results");
      }
      return false;
    }
    return currentKey === item.id || (item.id === "dashboard" && currentKey === "results" && activeTab === "results");
  };

  return (
    <div className="min-h-screen bg-transparent text-text font-body flex flex-col relative overflow-x-hidden">
      
      {/* Background Dot Overlay */}
      <div className="absolute inset-0 bg-dot-texture opacity-15 pointer-events-none z-0" />

      {/* Persistent Top Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl border border-border bg-surface text-text hover:bg-surfaceAlt cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <button 
            onClick={() => go("dashboard")} 
            className="cursor-pointer border-none bg-transparent outline-none flex items-center"
            title="Go to Dashboard"
          >
            <Logo />
          </button>
          
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          
          <span className="font-mono text-xs text-textMuted hidden lg:flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-cyan-400" /> {title}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Idea Intake CTA */}
          <button
            onClick={() => go("questions")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-surface border border-border text-text hover:bg-surfaceAlt hover:border-cyan-500/40 transition-all cursor-pointer shadow-xs"
          >
            <Rocket size={13} className="text-cyan-400" /> New Idea
          </button>

          {onExportBlueprint && (
            <button
              onClick={onExportBlueprint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none cursor-pointer shadow-cyber-cyan hover:scale-[1.02] transition-all"
            >
              <Download size={13} /> <span className="hidden sm:inline">Export</span> Blueprint
            </button>
          )}

          <ThemeToggle />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surfaceAlt transition-all cursor-pointer outline-none hover:border-cyan-500/40"
            >
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold font-mono uppercase">
                {(user?.name || "F").charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-text max-w-[80px] sm:max-w-[100px] truncate hidden xs:inline">
                {user?.name || "Founder"}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-surface border border-border shadow-xl p-1.5 z-50 animate-fadeUp text-left space-y-1">
                <div className="px-3 py-2 border-b border-border text-xs">
                  <p className="font-bold text-text truncate">{user?.name || "Founder"}</p>
                  <p className="text-[10px] text-textMuted font-mono truncate">{user?.email || "founder@startup.com"}</p>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    go("profile");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-text hover:bg-surfaceAlt transition-colors cursor-pointer border-none bg-transparent"
                >
                  <User size={14} className="text-cyan-400" /> Founder Profile
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    go("settings");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-text hover:bg-surfaceAlt transition-colors cursor-pointer border-none bg-transparent"
                >
                  <Settings size={14} className="text-cyan-400" /> Settings
                </button>
                <div className="border-t border-border pt-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (setUser) setUser(null);
                      go("landing");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Body with Persistent Sidebar */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Backdrop for mobile drawer */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)} 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
          />
        )}

        {/* Sidebar Container */}
        <aside
          className={`
            fixed md:static top-[57px] bottom-0 left-0 z-35
            w-64 border-r border-border bg-surface/95 md:bg-surface/70 backdrop-blur-md flex flex-col shrink-0
            transition-transform duration-300 ease-in-out
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Navigation Groups */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-left">
            {navItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="font-mono text-[9.5px] font-bold text-textMuted tracking-widest uppercase block mb-1.5 px-2">
                  {group.group}
                </span>

                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  const active = isItemActive(item);

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border text-left outline-none ${
                        active
                          ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-xs"
                          : "text-textMuted border-transparent hover:text-text hover:bg-surfaceAlt"
                      }`}
                    >
                      <ItemIcon size={16} />
                      <span className="flex-1">{item.label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Specialist Swarm Roster Status */}
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="font-mono text-[9.5px] font-bold text-textMuted tracking-widest uppercase block">
                  AI SWARM ROSTER ({selectedAgentsList.length})
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                {selectedAgentsList.map((a) => {
                  const Icon = a.icon;
                  const agentColor = getAgentColor(a.key, dark);

                  return (
                    <div
                      key={a.key}
                      className="flex items-center justify-between p-2 rounded-xl border border-border bg-surface hover:border-cyan-500/30 transition-all"
                      style={{ borderLeftColor: agentColor, borderLeftWidth: "3px" }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px]"
                          style={{ backgroundColor: `${agentColor}18`, color: agentColor }}
                        >
                          <Icon size={12} />
                        </div>
                        <span className="font-mono text-[10px] font-bold truncate text-text">
                          {a.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        READY
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Founder Status Widget */}
          <div className="p-3 border-t border-border bg-surfaceAlt/50 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                {(user?.name || "F").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text truncate">{user?.name || "Founder"}</p>
                <p className="text-[9.5px] text-emerald-400 font-mono font-semibold">● Workspace Online</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (setUser) setUser(null);
                go("landing");
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-textMuted hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer border-none bg-transparent transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </aside>

        {/* Dynamic Page Content Wrapper */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
