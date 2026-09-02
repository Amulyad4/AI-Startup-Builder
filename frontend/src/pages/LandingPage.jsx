import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Compass, Cpu, Target, ShieldCheck, Zap, Layers, BarChart3, CheckCircle2, Bot, Terminal, Award, Users, TrendingUp } from "lucide-react";
import Footer from "../components/Footer";
import { AGENTS, getAgentColor } from "../constants";
import { useTheme } from "../context/ThemeContext";
import Reveal, { Stagger, StaggerItem } from "../components/motion/Reveal";
import MagneticButton from "../components/motion/MagneticButton";
import heroImg from "../assets/hero_startup_agents.png";

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function LandingPage({ go }) {
  const { dark } = useTheme();

  return (
    <div className="font-body text-text overflow-hidden relative flex flex-col min-h-screen bg-transparent">
      
      {/* Dynamic Background Dot Overlay */}
      <div className="absolute inset-0 bg-dot-texture opacity-15 pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-16 md:pb-24 grid md:grid-cols-2 gap-12 items-center relative z-10 flex-1">
        
        {/* Left Column: Command Pitch */}
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start text-left relative z-10 space-y-6"
        >
          
          {/* Status Badge Pill */}
          <motion.div variants={heroItem} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold tracking-wider shadow-cyber-cyan">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06B6D4]" />
            <span>AI FOUNDER OS · 10 SPECIALIST AGENTS</span>
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 variants={heroItem} className="font-syne text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-text">
            Describe an idea once.
            <br />
            10 AI agents build your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500">
              investor blueprint.
            </span>
          </motion.h1>
          
          {/* Description */}
          <motion.p variants={heroItem} className="text-base sm:text-lg text-textMuted leading-relaxed max-w-lg">
            A multi-agent SaaS platform that orchestrates 10 specialized AI agents — market research, financial modeling, competitor moat, pitch deck — to generate an investor-ready blueprint in seconds.
          </motion.p>
          
          {/* Action CTAs */}
          <motion.div variants={heroItem} className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton
              onClick={() => go("questions")}
              strength={8}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm cursor-pointer shadow-cyber-cyan bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 hover:scale-[1.02] transition-transform"
            >
              Start Idea Intake 
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </MagneticButton>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => go("auth")}
              className="px-7 py-4 rounded-2xl font-bold border border-border text-text text-sm cursor-pointer bg-surface hover:bg-surfaceAlt hover:border-cyan-500/50 outline-none shadow-xs transition-all"
            >
              Sign in to Console
            </motion.button>
          </motion.div>

          {/* Key Metrics */}
          <motion.div variants={heroItem} className="grid grid-cols-3 gap-6 pt-6 border-t border-border w-full max-w-md font-mono">
            <div>
              <span className="font-display font-black text-2xl text-text block">10</span>
              <span className="text-[10px] text-textMuted uppercase font-bold tracking-wider">AI Specialists</span>
            </div>
            <div>
              <span className="font-display font-black text-2xl text-cyan-400 block">&lt; 28s</span>
              <span className="text-[10px] text-textMuted uppercase font-bold tracking-wider">Synthesis Speed</span>
            </div>
            <div>
              <span className="font-display font-black text-2xl text-emerald-400 block">100%</span>
              <span className="text-[10px] text-textMuted uppercase font-bold tracking-wider">Automated Fit</span>
            </div>
          </motion.div>

        </motion.div>
        
        {/* Right Column: AI Startup Planning Comic/Vector Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center items-center relative z-10"
        >
          <div className="relative group rounded-3xl overflow-hidden border border-border bg-surface shadow-2xl p-2.5 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyber-cyan">
            
            {/* Glowing Accent Ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <img
              src={heroImg}
              alt="AI Startup Team & Agents Collaborating"
              className="w-full h-auto rounded-2xl object-cover relative z-10 shadow-md transform transition-transform duration-500 group-hover:scale-[1.01]"
            />

            {/* Floating Info Badges */}
            <div className="absolute top-6 left-6 z-20 bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 font-mono text-xs text-cyan-300">
              <Users size={14} className="text-cyan-400 animate-pulse" />
              <span>COLLABORATIVE AI AGENT SWARM</span>
            </div>

            <div className="absolute bottom-6 right-6 z-20 bg-slate-950/90 backdrop-blur-md border border-emerald-500/30 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 font-mono text-xs text-emerald-400">
              <TrendingUp size={14} />
              <span>INVESTOR BLUEPRINT READY</span>
            </div>
          </div>
        </motion.div>

      </section>

      {/* 3-STEP PIPELINE WORKFLOW */}
      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10 w-full">
        <Reveal className="flex items-center gap-3 mb-10">
          <span className="font-mono text-xs tracking-widest text-cyan-400 font-bold uppercase">EXECUTION PIPELINE</span>
          <div className="h-[1px] flex-1 bg-border" />
        </Reveal>
        
        <Stagger className="grid sm:grid-cols-3 gap-6" stagger={0.1}>
          {[
            { 
              step: "01", 
              title: "Concept Intake", 
              desc: "Describe your startup idea, target market, or core problem in plain prose.", 
              icon: Terminal
            },
            { 
              step: "02", 
              title: "Module Selection & Run", 
              desc: "Select which specialist agents to execute from the 10-agent neural roster.", 
              icon: Cpu
            },
            { 
              step: "03", 
              title: "Results Thread & Export", 
              desc: "Review compiled reports, stat flashcards, pitch deck slides, and export blueprints.", 
              icon: ShieldCheck
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <StaggerItem
                key={s.step}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bento-card p-7 rounded-3xl border border-border bg-surface hover:border-cyan-500/60 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                      STAGE {s.step}
                    </span>
                    <Icon size={20} className="text-textMuted" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2 text-text">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ACTIVE 10-AGENT ROSTER BENTO GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-28 relative z-10 w-full">
        <Reveal className="flex items-center gap-3 mb-10">
          <span className="font-mono text-xs tracking-widest text-cyan-400 font-bold uppercase">10 SPECIALIST AGENT MODULES</span>
          <div className="h-[1px] flex-1 bg-border" />
        </Reveal>
        
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" stagger={0.05}>
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const agentColor = getAgentColor(agent.key, dark);

            return (
              <StaggerItem
                key={agent.key}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="bento-card p-5 rounded-3xl border bg-surface flex flex-col justify-between text-left group"
                style={{
                  borderTop: `3px solid ${agentColor}`
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs"
                      style={{
                        backgroundColor: `${agentColor}18`,
                        color: agentColor
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ● READY
                    </span>
                  </div>

                  <span className="font-mono text-[10px] font-bold block mb-1" style={{ color: agentColor }}>
                    {agent.tag}
                  </span>
                  <h4 className="font-display font-bold text-sm mb-1.5 text-text group-hover:text-cyan-400 transition-colors">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-textMuted leading-relaxed line-clamp-3">
                    {agent.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Footer */}
      <Footer go={go} />

    </div>
  );
}
