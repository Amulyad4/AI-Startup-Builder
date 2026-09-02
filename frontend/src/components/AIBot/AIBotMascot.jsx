import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  mascotContainerVariants,
  EMOTION_AURA_COLORS,
  EMOTION_ANTENNA_COLORS,
  EMOTION_FACIAL_CONFIGS
} from "./botAnimations";
import { botEmotionManager } from "./BotEmotionManager";

const QUICK_EMOTE_SELECT = [
  { id: "happy", emote: "🎉", label: "Happy" },
  { id: "thinking", emote: "🤔", label: "Think" },
  { id: "encouraging", emote: "✨", label: "Cheer" },
  { id: "celebrating", emote: "🚀", label: "Rocket" },
  { id: "concerned", emote: "⚠️", label: "Warn" },
  { id: "sleepy", emote: "😴", label: "Sleep" },
  { id: "surprised", emote: "😮", label: "Wow" },
];

export default function AIBotMascot({
  emotion = "idle",
  size = 84,
  onClick = null,
  showEmotePicker = true,
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scanBeamPos, setScanBeamPos] = useState(0);

  // Track cursor position for interactive eye pupil movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;
      setMousePos({ x: normX, y: normY });
    };
    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMouseMove);
  }, []);

  // Natural Eye Blinking Timer (Blinks every 3.6s)
  useEffect(() => {
    const interval = setInterval(() => {
      if (emotion !== "sleepy") {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 180);
      }
    }, 3600);
    return () => clearInterval(interval);
  }, [emotion]);

  // Laser Scan Beam Sweep animation for "thinking" mode
  useEffect(() => {
    let animId;
    let pos = 0;
    let dir = 1;
    const animateScan = () => {
      pos += 0.9 * dir;
      if (pos > 22 || pos < 0) dir *= -1;
      setScanBeamPos(pos);
      animId = requestAnimationFrame(animateScan);
    };
    if (emotion === "thinking") {
      animId = requestAnimationFrame(animateScan);
    }
    return () => cancelAnimationFrame(animId);
  }, [emotion]);

  // Eye pupil offset based on cursor (clamped)
  const eyeX = emotion === "sleepy" ? 0 : Math.min(5, Math.max(-5, mousePos.x * 6));
  const eyeY = emotion === "sleepy" ? 0 : Math.min(4, Math.max(-4, mousePos.y * 5));

  const facialConfig = EMOTION_FACIAL_CONFIGS[emotion] || EMOTION_FACIAL_CONFIGS.idle;
  const auraGradient = EMOTION_AURA_COLORS[emotion] || EMOTION_AURA_COLORS.idle;
  const antennaColor = EMOTION_ANTENNA_COLORS[emotion] || EMOTION_ANTENNA_COLORS.idle;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center select-none font-body"
    >
      {/* POP-UP QUICK EMOTE PICKER ON HOVER */}
      <AnimatePresence>
        {isHovered && showEmotePicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-950/90 border border-cyan-500/40 p-1.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-1 font-mono text-xs whitespace-nowrap"
          >
            <span className="text-[9px] font-bold text-cyan-400 px-1 uppercase tracking-wider hidden sm:inline">
              EMOTIONS:
            </span>
            {QUICK_EMOTE_SELECT.map((b) => (
              <motion.button
                key={b.id}
                whileHover={{ scale: 1.25, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  botEmotionManager.setEmotion(b.id, 5000);
                }}
                className={`w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer border transition-all ${
                  emotion === b.id
                    ? "bg-cyan-500/30 border-cyan-400 text-white font-bold shadow-[0_0_10px_#06B6D4]"
                    : "border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700"
                }`}
                title={b.label}
              >
                <span className="text-xs">{b.emote}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFETTI / SPARKLE PARTICLE OVERLAY FOR CELEBRATING & HAPPY */}
      {(emotion === "celebrating" || emotion === "happy") && (
        <div className="absolute -inset-6 pointer-events-none z-30 flex items-center justify-center">
          <motion.div
            animate={{ scale: [0.8, 1.3, 0.9], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-xs space-x-2"
          >
            <span>✨</span>
            <span>🎉</span>
            <span>🚀</span>
          </motion.div>
        </div>
      )}

      {/* SLEEPY 'zZz' FLOATING BUBBLES */}
      {emotion === "sleepy" && (
        <div className="absolute -top-6 right-1 pointer-events-none z-30 font-mono font-bold text-cyan-400 text-xs">
          <motion.div
            animate={{ y: [-2, -12, -18], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
          >
            zZz...
          </motion.div>
        </div>
      )}

      {/* PURE VECTOR ARTICULATED 3D-STYLE ROBOT CHARACTER */}
      <motion.div
        variants={mascotContainerVariants}
        animate={emotion}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={onClick}
        className="relative group cursor-pointer"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {/* Glowing Aura Ring */}
        <div
          className={`absolute -inset-2 rounded-3xl bg-gradient-to-r ${auraGradient} blur-md opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none`}
        />

        {/* Outer Capsule Container */}
        <div className="w-full h-full rounded-3xl bg-surface border border-border group-hover:border-cyan-400/80 p-1 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl transition-all">
          {/* Specular Visor Glass Highlight */}
          <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-white/20 blur-sm pointer-events-none" />

          {/* SVG Character */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md overflow-visible relative z-10"
          >
            <defs>
              <linearGradient id="chromeOuter" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#E2E8F0" />
                <stop offset="85%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              <linearGradient id="chromeDark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="60%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="visorScreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#030712" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>

              <filter id="cyberGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Plasma Thruster Flame */}
            <ellipse cx="50" cy="94" rx="16" ry="4" fill={antennaColor} opacity="0.6" filter="url(#cyberGlow)" />
            <polygon points="44,92 50,99 56,92" fill={antennaColor} opacity="0.9" filter="url(#cyberGlow)" />

            {/* LEFT ARTICULATED ROBOTIC ARM */}
            <g transform={emotion === "celebrating" || emotion === "surprised" ? "rotate(-45 28 58)" : "rotate(0 28 58)"}>
              <circle cx="27" cy="54" r="4" fill="url(#chromeDark)" stroke={antennaColor} strokeWidth="0.8" />
              <rect x="22" y="54" width="8" height="17" rx="4" fill="url(#chromeOuter)" stroke="#475569" strokeWidth="0.8" />
              <circle cx="26" cy="73" r="3.5" fill={antennaColor} filter="url(#cyberGlow)" />
            </g>

            {/* RIGHT ARTICULATED WAVING/RAISED ARM */}
            <g
              style={{
                transformOrigin: "73px 54px",
                transform:
                  emotion === "happy" || emotion === "idle"
                    ? "rotate(-65deg)"
                    : emotion === "celebrating" || emotion === "surprised"
                    ? "rotate(50deg)"
                    : "rotate(0deg)",
                transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <circle cx="73" cy="54" r="4" fill="url(#chromeDark)" stroke={antennaColor} strokeWidth="0.8" />
              <rect x="69" y="54" width="8" height="17" rx="4" fill="url(#chromeOuter)" stroke="#475569" strokeWidth="0.8" />
              <circle cx="73" cy="73" r="3.5" fill={antennaColor} filter="url(#cyberGlow)" />
            </g>

            {/* CHEST CHASSIS */}
            <rect x="30" y="46" width="40" height="36" rx="14" fill="url(#chromeOuter)" stroke="#334155" strokeWidth="1.2" />
            <rect x="35" y="50" width="30" height="28" rx="10" fill="url(#chromeDark)" stroke={antennaColor} strokeWidth="0.6" strokeOpacity="0.4" />

            {/* Arc Reactor Chest Core */}
            <circle cx="50" cy="64" r="7" fill="#0F172A" stroke={antennaColor} strokeWidth="1.2" />
            <circle cx="50" cy="64" r="4.5" fill={antennaColor} filter="url(#cyberGlow)" className="animate-pulse" />
            <circle cx="50" cy="64" r="2" fill="#FFFFFF" />

            {/* HEAD & VISOR ASSEMBLY (Tracks Cursor) */}
            <g
              style={{
                transformOrigin: "50px 28px",
                transform: `translate(${eyeX * 0.45}px, ${eyeY * 0.45}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              {/* Antenna Stem & Top LED Sphere */}
              <line x1="50" y1="8" x2="50" y2="2" stroke="#475569" strokeWidth="2" />
              <circle cx="50" cy="2" r="3.5" fill={antennaColor} filter="url(#cyberGlow)" className="animate-pulse" />

              {/* Ears */}
              <rect x="15" y="24" width="7" height="12" rx="3.5" fill="url(#chromeDark)" stroke={antennaColor} strokeWidth="0.8" />
              <rect x="78" y="24" width="7" height="12" rx="3.5" fill="url(#chromeDark)" stroke={antennaColor} strokeWidth="0.8" />

              {/* Head Shell & Visor Screen */}
              <rect x="20" y="8" width="60" height="40" rx="20" fill="url(#chromeOuter)" stroke="#475569" strokeWidth="1.4" />
              <rect x="25" y="14" width="50" height="28" rx="14" fill="url(#visorScreen)" stroke={antennaColor} strokeWidth="1" />

              {/* Thinking Scan Beam Laser */}
              {facialConfig.scanBeam && (
                <line
                  x1="28"
                  y1={16 + scanBeamPos}
                  x2="72"
                  y2={16 + scanBeamPos}
                  stroke="#F59E0B"
                  strokeWidth="2"
                  filter="url(#cyberGlow)"
                />
              )}

              {/* Dynamic Eyes & Face Render */}
              {!isBlinking && emotion !== "sleepy" ? (
                <g transform={`translate(${eyeX}, ${eyeY})`}>
                  {/* HAPPY / IDLE / ENCOURAGING EYES */}
                  {(emotion === "idle" || emotion === "happy" || emotion === "encouraging") && (
                    <>
                      <path d="M 33 27 Q 38 21 43 27" fill="none" stroke={antennaColor} strokeWidth="3" strokeLinecap="round" filter="url(#cyberGlow)" />
                      <path d="M 57 27 Q 62 21 67 27" fill="none" stroke={antennaColor} strokeWidth="3" strokeLinecap="round" filter="url(#cyberGlow)" />
                      <path d="M 45 35 Q 50 39 55 35" fill="none" stroke={antennaColor} strokeWidth="2" strokeLinecap="round" filter="url(#cyberGlow)" />
                    </>
                  )}

                  {/* THINKING EYES */}
                  {emotion === "thinking" && (
                    <>
                      <circle cx="38" cy="27" r="4.5" fill="none" stroke="#F59E0B" strokeWidth="2.5" filter="url(#cyberGlow)" />
                      <circle cx="62" cy="27" r="4.5" fill="none" stroke="#F59E0B" strokeWidth="2.5" filter="url(#cyberGlow)" />
                      <rect x="42" y="34" width="16" height="2.5" rx="1" fill="#F59E0B" filter="url(#cyberGlow)" />
                    </>
                  )}

                  {/* CELEBRATING STARRY EYES */}
                  {emotion === "celebrating" && (
                    <>
                      <text x="32" y="31" fontSize="12" fill="#EC4899" filter="url(#cyberGlow)">★</text>
                      <text x="56" y="31" fontSize="12" fill="#EC4899" filter="url(#cyberGlow)">★</text>
                      <path d="M 43 34 Q 50 40 57 34" fill="none" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" filter="url(#cyberGlow)" />
                    </>
                  )}

                  {/* CONCERNED WORRIED EYES */}
                  {emotion === "concerned" && (
                    <>
                      <line x1="32" y1="23" x2="42" y2="26" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
                      <line x1="68" y1="23" x2="58" y2="26" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="37" cy="28" r="3" fill="#F43F5E" filter="url(#cyberGlow)" />
                      <circle cx="63" cy="28" r="3" fill="#F43F5E" filter="url(#cyberGlow)" />
                      <path d="M 44 37 Q 50 33 56 37" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
                    </>
                  )}

                  {/* SURPRISED WIDE OPEN EYES */}
                  {emotion === "surprised" && (
                    <>
                      <circle cx="37" cy="27" r="6" fill="#A855F7" filter="url(#cyberGlow)" />
                      <circle cx="63" cy="27" r="6" fill="#A855F7" filter="url(#cyberGlow)" />
                      <circle cx="37" cy="27" r="2.5" fill="#FFFFFF" />
                      <circle cx="63" cy="27" r="2.5" fill="#FFFFFF" />
                      <circle cx="50" cy="35" r="3.5" fill="none" stroke="#A855F7" strokeWidth="2" filter="url(#cyberGlow)" />
                    </>
                  )}
                </g>
              ) : (
                /* SLEEPY / BLINKING SLITS */
                <g>
                  <line x1="32" y1="27" x2="44" y2="27" stroke={antennaColor} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="56" y1="27" x2="68" y2="27" stroke={antennaColor} strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}

              {/* Visor Glass Specular Shine */}
              <path d="M 27 16 Q 50 12 73 16 Q 50 20 27 16 Z" fill="url(#glassReflection)" />
            </g>
          </svg>

          {/* LED Name Badge */}
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 z-20 px-2 py-0.2 rounded-full bg-slate-950/90 border border-cyan-500/40 text-[8px] font-mono font-bold text-cyan-300 tracking-wider shadow-xs whitespace-nowrap">
            CYRA-1 AI
          </div>
        </div>

        {/* Active Status Pulse Dot */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_#10B981] z-30 animate-pulse" />
      </motion.div>
    </div>
  );
}
