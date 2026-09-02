import React from "react";
import Logo from "./Logo";

export default function Footer({ go }) {
  return (
    <footer className="border-t border-border bg-surface/50 backdrop-blur-md font-body text-text relative z-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-border/60">
          
          {/* Brand Info Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <button onClick={() => go && go("landing")} className="cursor-pointer border-none bg-transparent p-0 outline-none">
              <Logo />
            </button>
            <p className="text-xs text-textMuted leading-relaxed max-w-sm">
              AI Startup Builder is an autonomous multi-agent platform designed to synthesize 14-section investor blueprints, market validation, unit economics, and pitch deck outlines from a single concept input.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All 10 Swarm Agents Operational</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3 text-left">
            <h4 className="font-mono text-xs font-bold text-primary tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-xs text-textMuted">
              <li><button onClick={() => go && go("questions")} className="hover:text-text cursor-pointer border-none bg-transparent p-0">Idea Intake</button></li>
              <li><button onClick={() => go && go("auth")} className="hover:text-text cursor-pointer border-none bg-transparent p-0">Supervisor Workbench</button></li>
              <li><span className="opacity-70">10 Specialist Agents</span></li>
              <li><span className="opacity-70">Investor Blueprint Engine</span></li>
            </ul>
          </div>

          {/* Column 2: Agents Roster */}
          <div className="space-y-3 text-left">
            <h4 className="font-mono text-xs font-bold text-primary tracking-wider uppercase">Active Agents</h4>
            <ul className="space-y-2 text-xs text-textMuted">
              <li><span className="opacity-70">AGENT.01 · Idea Validation</span></li>
              <li><span className="opacity-70">AGENT.02 · Market Research</span></li>
              <li><span className="opacity-70">AGENT.03 · Competitor Analysis</span></li>
              <li><span className="opacity-70">AGENT.07 · Financial Forecast</span></li>
            </ul>
          </div>

          {/* Column 3: Legal & Team */}
          <div className="space-y-3 text-left">
            <h4 className="font-mono text-xs font-bold text-primary tracking-wider uppercase">Academic Project</h4>
            <ul className="space-y-2 text-xs text-textMuted">
              <li><span className="opacity-70">CVR College of Engineering</span></li>
              <li><span className="opacity-70">Department of CSE (AI & ML)</span></li>
              <li><span className="opacity-70">Multi-Agent Intelligent System</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-textMuted">
          <div>
            © {new Date().getFullYear()} AI Startup Builder. Powered by Groq LPU & Multi-Agent Swarms.
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span className="hover:text-text cursor-pointer">Privacy Policy</span>
            <span className="hover:text-text cursor-pointer">Terms of Service</span>
            <span className="hover:text-text cursor-pointer">Security Safeguards</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
