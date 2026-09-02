import React from "react";
import { Sparkles } from "lucide-react";

export default function Logo({ size = "normal" }) {
  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Glowing Emblem Box */}
      <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-indigo-500 to-accent p-0.5 shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/30">
        <div className="w-8 h-8 md:w-9 md:h-9 bg-surface rounded-[14px] flex items-center justify-center transition-colors">
          <Sparkles size={18} className="text-primary animate-pulse" />
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-black tracking-tight text-lg md:text-xl text-text">
            Startup<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Builder</span>
          </span>
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primarySoft text-primary border border-primary/20">
            AI OS
          </span>
        </div>
      </div>
    </div>
  );
}
