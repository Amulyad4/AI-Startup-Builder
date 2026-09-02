/**
 * Animation variants, SVG facial geometry paths, and timing presets for the AI Bot Mascot.
 * Supports 7 emotion states: happy, thinking, encouraging, celebrating, concerned, sleepy, surprised (+ idle).
 */

// Mascot Levitation Hover Animations per Emotion State
export const mascotContainerVariants = {
  idle: {
    y: [0, -6, 0],
    rotate: [0, 1.5, 0, -1.5, 0],
    transition: {
      duration: 3.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  happy: {
    y: [0, -12, 0, -8, 0],
    scale: [1, 1.06, 0.98, 1.04, 1],
    rotate: [0, -4, 4, -2, 0],
    transition: {
      duration: 1.4,
      repeat: Infinity,
      repeatDelay: 0.2,
      ease: "easeOut"
    }
  },
  thinking: {
    y: [0, -4, 0],
    rotate: [0, -3, 0, 3, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  encouraging: {
    y: [0, -7, 0],
    scale: [1, 1.04, 1],
    rotate: [0, 2, 0, -2, 0],
    transition: {
      duration: 2.8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  celebrating: {
    y: [0, -16, 0, -10, 0],
    scale: [1, 1.12, 0.95, 1.08, 1],
    rotate: [0, -8, 8, -4, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatDelay: 0.1,
      ease: "backOut"
    }
  },
  concerned: {
    y: [0, -3, 0],
    rotate: [-4, -6, -4],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  sleepy: {
    y: [2, 6, 2],
    scale: [0.98, 0.96, 0.98],
    rotate: [-2, 0, -2],
    transition: {
      duration: 4.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  surprised: {
    y: [0, -14, -6],
    scale: [1, 1.18, 1.05],
    rotate: [0, 0, 0],
    transition: {
      duration: 0.6,
      ease: "backOut"
    }
  }
};

// Aura Glow Styles per Emotion State
export const EMOTION_AURA_COLORS = {
  idle: "from-cyan-500/40 via-indigo-500/30 to-purple-500/40",
  happy: "from-emerald-400/60 via-teal-400/40 to-cyan-500/60",
  thinking: "from-amber-400/60 via-orange-500/40 to-yellow-400/50",
  encouraging: "from-sky-400/60 via-indigo-400/40 to-teal-400/50",
  celebrating: "from-purple-500/70 via-pink-500/60 to-cyan-400/70",
  concerned: "from-rose-500/60 via-amber-500/40 to-orange-500/50",
  sleepy: "from-slate-500/40 via-indigo-900/40 to-blue-900/30",
  surprised: "from-cyan-400/80 via-fuchsia-500/70 to-yellow-300/80"
};

// Antenna LED Color per Emotion State
export const EMOTION_ANTENNA_COLORS = {
  idle: "#06B6D4",
  happy: "#10B981",
  thinking: "#F59E0B",
  encouraging: "#38BDF8",
  celebrating: "#EC4899",
  concerned: "#F43F5E",
  sleepy: "#64748B",
  surprised: "#A855F7"
};

// SVG Facial Expressions Renderer Mapping
export const EMOTION_FACIAL_CONFIGS = {
  idle: {
    eyeType: "curved_happy",
    mouthType: "gentle_smile",
    blush: true,
    scanBeam: false
  },
  happy: {
    eyeType: "joy_arcs",
    mouthType: "wide_smile",
    blush: true,
    sparkles: true,
    scanBeam: false
  },
  thinking: {
    eyeType: "focused_gaze",
    mouthType: "straight_thoughtful",
    blush: false,
    scanBeam: true
  },
  encouraging: {
    eyeType: "sparkling_eyes",
    mouthType: "warm_smile",
    blush: true,
    scanBeam: false
  },
  celebrating: {
    eyeType: "star_eyes",
    mouthType: "open_cheer",
    blush: true,
    confetti: true,
    scanBeam: false
  },
  concerned: {
    eyeType: "worried_brows",
    mouthType: "wavy_frown",
    blush: false,
    scanBeam: false
  },
  sleepy: {
    eyeType: "sleepy_slits",
    mouthType: "small_o",
    blush: true,
    zzz: true,
    scanBeam: false
  },
  surprised: {
    eyeType: "wide_glow_circles",
    mouthType: "wide_o",
    blush: true,
    starburst: true,
    scanBeam: false
  }
};
