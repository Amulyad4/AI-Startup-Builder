import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative flex items-center justify-between w-16 h-8 rounded-full p-1 border cursor-pointer transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-slate-200 border-slate-400 hover:border-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:hover:border-slate-400 shadow-sm group"
    >
      {/* Track Background Status Indicators (Sun left, Moon right) */}
      <span className="flex items-center justify-center w-5 h-5 text-amber-600 dark:text-slate-500 font-bold transition-opacity">
        <Sun size={12} className={dark ? "opacity-40" : "opacity-100"} />
      </span>
      <span className="flex items-center justify-center w-5 h-5 text-slate-400 dark:text-indigo-400 font-bold transition-opacity">
        <Moon size={12} className={dark ? "opacity-100" : "opacity-40"} />
      </span>

      {/* Moving Sliding Thumb Circle */}
      <div
        className="absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md border transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white border-slate-300 dark:bg-indigo-600 dark:border-indigo-400 group-hover:scale-105"
        style={{
          transform: dark ? "translateX(32px)" : "translateX(0px)"
        }}
      >
        {dark ? (
          <Moon size={12} className="text-white shrink-0" />
        ) : (
          <Sun size={12} className="text-amber-500 shrink-0" />
        )}
      </div>
    </button>
  );
}
