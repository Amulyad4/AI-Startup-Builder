import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, User, AlertCircle, CheckCircle2, ShieldCheck, Terminal, Cpu, Bot, Users } from "lucide-react";
import Footer from "../components/Footer";
import authImg from "../assets/auth_ai_bots.png";

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
    <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function AuthPage({ go, setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPw, setShowPw] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!email || !email.includes("@")) {
      errs.email = "Valid email address is required (e.g. founder@startup.com)";
    }
    if (!password || password.length < 6) {
      errs.password = "Password must be at least 6 characters long";
    }
    if (isSignUp && (!name || !name.trim())) {
      errs.name = "Full name is required to create a founder profile";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const userName = isSignUp ? name.trim() : (email.split("@")[0] || "Founder");
      setUser({ name: userName, email: email.trim() || "founder@startup.com" });
      go("questions");
    }, 500);
  };

  const handleOAuth = (provider) => {
    setUser({ name: `${provider} Founder`, email: `innovator@${provider.toLowerCase()}.com` });
    go("questions");
  };

  return (
    <div className="flex flex-col min-h-screen font-body text-text bg-bg">
      <div className="flex-1 grid lg:grid-cols-2 min-h-full">
        
        {/* LEFT COLUMN: Comic AI Bots Working Side Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center relative p-12 border-r border-border bg-surface/40 backdrop-blur-md overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-dot-texture opacity-15 pointer-events-none" />
          
          <div className="w-full max-w-lg z-10 space-y-4">
            <div className="relative group rounded-3xl overflow-hidden border border-border bg-surface shadow-2xl p-2.5 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyber-cyan">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <img
                src={authImg}
                alt="AI Bots Typing & Thinking for Founder"
                className="w-full h-auto rounded-2xl object-cover relative z-10 shadow-md"
              />
            </div>
          </div>

          <div className="text-center max-w-md z-10 space-y-2 animate-fadeUp">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold uppercase border border-cyan-500/20">
              <Bot size={13} /> 10 AI SPECIALISTS AT YOUR COMMAND
            </div>
            <h3 className="font-display text-2xl font-bold text-text">
              Your AI Specialist Team is Ready
            </h3>
            <p className="text-xs text-textMuted leading-relaxed">
              Sign in to dispatch your startup concept to 10 AI specialist agents who research markets, model financials, and draft pitch decks for you.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Panel */}
        <div className="flex items-center justify-center p-6 sm:p-12 relative z-10">
          <div className="w-full max-w-md bg-surface border border-border p-8 rounded-3xl shadow-xl space-y-6 text-left animate-fadeUp hover:border-cyan-500/30 transition-all">
            
            {/* Sign In vs Create Account Tabs */}
            <div className="flex bg-surfaceAlt p-1 rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrors({});
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none outline-none ${
                  !isSignUp
                    ? "bg-surface text-text shadow-sm"
                    : "text-textMuted hover:text-text"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrors({});
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none outline-none ${
                  isSignUp
                    ? "bg-surface text-text shadow-sm"
                    : "text-textMuted hover:text-text"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-bold tracking-tight text-text">
                {isSignUp ? "Create Founder Account" : "Welcome back"}
              </h1>
              <p className="text-xs text-textMuted leading-relaxed">
                {isSignUp
                  ? "Initialize your workspace to build investor-ready blueprints."
                  : "Enter your credentials to access the supervisor workbench."}
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleOAuth("Google")}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-surfaceAlt text-text text-xs font-semibold outline-none cursor-pointer shadow-xs hover:border-cyan-500/40 transition-all"
              >
                <GoogleIcon /> Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth("GitHub")}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-surfaceAlt text-text text-xs font-semibold outline-none cursor-pointer shadow-xs hover:border-cyan-500/40 transition-all"
              >
                <GithubIcon /> Continue with GitHub
              </button>
            </div>

            <div className="flex items-center gap-3 my-2">
              <div className="h-[1px] flex-1 bg-border" />
              <span className="text-[9px] font-mono text-textMuted uppercase tracking-widest">OR WITH EMAIL</span>
              <div className="h-[1px] flex-1 bg-border" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <label className="text-xs font-bold text-text">Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                        }}
                        placeholder="Sarah Connor"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-xs bg-bg text-text transition-all font-medium ${
                          errors.name ? "border-rose-500" : "border-border focus:border-cyan-400"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    placeholder="founder@startup.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-xs bg-bg text-text transition-all font-medium ${
                      errors.email ? "border-rose-500" : "border-border focus:border-cyan-400"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-text">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => go("questions")}
                      className="text-[11px] text-cyan-400 font-bold hover:underline border-none bg-transparent cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none text-xs bg-bg text-text transition-all font-medium ${
                      errors.password ? "border-rose-500" : "border-border focus:border-cyan-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted cursor-pointer hover:text-text border-none bg-transparent"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-white text-xs transition-all cursor-pointer shadow-cyber-cyan bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none flex items-center justify-center gap-2 disabled:opacity-60 mt-2 focus-visible:ring-2 focus-visible:ring-cyan-400 hover:scale-[1.01]"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Initialize Founder Account" : "Sign In to Console"} <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-1 border-t border-border">
              <p className="text-xs text-textMuted">
                {isSignUp ? "Already have an account?" : "New to Swarm OS?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                  }}
                  className="text-cyan-400 font-bold hover:underline border-none bg-transparent cursor-pointer"
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>

      <Footer go={go} />
    </div>
  );
}
