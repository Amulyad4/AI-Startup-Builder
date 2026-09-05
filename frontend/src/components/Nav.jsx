import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight, Menu, X, LogOut, LayoutDashboard, Sliders, User, Sparkles, CheckSquare, History, Settings } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import MagneticButton from "./motion/MagneticButton";

export default function Nav({ go, current, user, setUser }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
  });

  const links = [
    { id: "landing", label: "Overview" },
    ...(user ? [
      { id: "questions", label: "Idea Intake" },
      { id: "select", label: "Select Agents" },
      { id: "results", label: "Results Thread" },
      { id: "history", label: "History" },
      { id: "profile", label: "Profile" }
    ] : [
      { id: "auth", label: "Sign in" }
    ]),
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${
        scrolled
          ? "bg-surface/90 border-border shadow-xs"
          : "bg-surface/60 border-border/40"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        {/* Brand Logo */}
        <button
          onClick={() => go("landing")}
          className="cursor-pointer border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <Logo />
        </button>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 font-body text-xs font-semibold">
          {links.map((l) => {
            const isActive = current === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer border outline-none ${
                  isActive
                    ? "text-primary bg-primarySoft border-primary/30 font-bold shadow-xs"
                    : "text-textMuted border-transparent hover:text-text hover:bg-surfaceAlt hover:border-border"
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </nav>

        {/* Action Group Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="hidden sm:flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-xl shadow-xs text-xs font-semibold">
              <button
                onClick={() => go("profile")}
                className="flex items-center gap-2 border-none bg-transparent cursor-pointer p-0 text-left outline-none hover:opacity-85"
              >
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-[10px] font-mono font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-text max-w-[90px] truncate">{user.name}</span>
              </button>
              <div className="w-[1px] h-3.5 bg-border" />
              <button
                onClick={() => {
                  setUser(null);
                  go("landing");
                }}
                title="Sign Out"
                className="text-textMuted hover:text-rose-500 cursor-pointer flex items-center gap-1 border-none bg-transparent p-0 outline-none transition-colors"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <MagneticButton
              onClick={() => go("questions")}
              strength={6}
              className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer shadow-md hover:shadow-primary/30 bg-gradient-to-r from-primary to-indigo-600 border-none outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Get started <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </MagneticButton>
          )}

          {/* Mobile Menu Trigger */}
          <button
            className="md:hidden text-text cursor-pointer border border-border p-2 rounded-xl bg-surface hover:bg-surfaceAlt outline-none"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden flex flex-col px-6 bg-surface border-b border-border shadow-lg"
          >
            <div className="py-4 flex flex-col gap-1.5">
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    go(l.id);
                    setOpen(false);
                  }}
                  className={`text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border outline-none ${
                    current === l.id
                      ? "text-primary bg-primarySoft border-primary/30 font-bold"
                      : "text-textMuted border-transparent hover:bg-surfaceAlt hover:text-text"
                  }`}
                >
                  {l.label}
                </button>
              ))}

              {user ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surfaceAlt border border-border mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-mono font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-xs text-text">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setUser(null);
                      setOpen(false);
                      go("landing");
                    }}
                    className="text-xs text-rose-500 font-bold flex items-center gap-1 cursor-pointer border-none bg-transparent"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    go("questions");
                    setOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-indigo-600 mt-2 border-none outline-none cursor-pointer"
                >
                  Get started <ArrowRight size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
