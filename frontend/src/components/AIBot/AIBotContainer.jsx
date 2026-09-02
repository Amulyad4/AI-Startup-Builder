import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChevronRight } from "lucide-react";
import AIBotMascot from "./AIBotMascot";
import AIBotPanel from "./AIBotPanel";
import { botEmotionManager } from "./BotEmotionManager";
import { getContextAwareTip } from "./BotTipsEngine";

export default function AIBotContainer({ go = null, current = "landing" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [emotion, setEmotion] = useState(() => botEmotionManager.getEmotion());
  const [proactiveTipsEnabled, setProactiveTipsEnabled] = useState(() => {
    return localStorage.getItem("bot_proactive_tips") !== "false";
  });

  const [intakeData, setIntakeData] = useState({});

  // Sync state & localStorage
  useEffect(() => {
    localStorage.setItem("bot_proactive_tips", proactiveTipsEnabled ? "true" : "false");
  }, [proactiveTipsEnabled]);

  // Subscribe to bot emotion state updates
  useEffect(() => {
    const unsubscribe = botEmotionManager.subscribe((newEmotion) => {
      setEmotion(newEmotion);
    });
    return () => unsubscribe();
  }, []);

  // Poll/read current intake data from localStorage to keep context updated
  useEffect(() => {
    const readIntake = () => {
      const saved = localStorage.getItem("startup_intake");
      if (saved) {
        try {
          setIntakeData(JSON.parse(saved));
        } catch (e) {}
      } else {
        setIntakeData({ idea: localStorage.getItem("startup_idea") || "" });
      }
    };
    readIntake();
    const interval = setInterval(readIntake, 3000);
    return () => clearInterval(interval);
  }, [current]);

  // Calculate context-aware tip for current page
  const tipData = getContextAwareTip(current, intakeData);

  // Auto-trigger tip emotion on route change
  useEffect(() => {
    if (tipData?.emotion && emotion === "idle") {
      botEmotionManager.setEmotion(tipData.emotion, 4000);
    }
  }, [current]);

  const handleMascotClick = () => {
    if (emotion === "sleepy") {
      botEmotionManager.setEmotion("happy", 3000);
    }
    setIsOpen(!isOpen);
    setShowBubble(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-body">
      {/* PROACTIVE SPEECH BUBBLE CALLOUT */}
      <AnimatePresence>
        {showBubble && !isOpen && proactiveTipsEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-24 right-0 bg-surface/95 border border-border p-4 rounded-3xl shadow-2xl w-80 max-w-[calc(100vw-3rem)] text-left space-y-2 backdrop-blur-xl hover:border-cyan-400/60 transition-all z-40"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9.5px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                CYRA-1 · {tipData.title}
              </span>
              <button
                onClick={() => setShowBubble(false)}
                className="text-textMuted hover:text-text cursor-pointer border-none bg-transparent"
                title="Dismiss tip"
              >
                <X size={13} />
              </button>
            </div>

            <p className="text-xs text-text font-medium leading-relaxed">
              {tipData.message}
            </p>

            <button
              onClick={() => {
                setIsOpen(true);
                setShowBubble(false);
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline border-none bg-transparent cursor-pointer pt-0.5 block"
            >
              {tipData.actionLabel || "Chat with CYRA-1"} <ChevronRight size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING MASCOT BUTTON */}
      <AIBotMascot
        emotion={emotion}
        size={82}
        onClick={handleMascotClick}
        showEmotePicker={!isOpen}
      />

      {/* EXPANDED INTERACTIVE ASSISTANT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <AIBotPanel
            onClose={() => setIsOpen(false)}
            currentRoute={current}
            intakeData={intakeData}
            go={go}
            proactiveTipsEnabled={proactiveTipsEnabled}
            setProactiveTipsEnabled={setProactiveTipsEnabled}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
