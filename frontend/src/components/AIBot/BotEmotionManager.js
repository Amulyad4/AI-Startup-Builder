/**
 * BotEmotionManager handles dynamic emotion state transitions, inactivity detection,
 * and event dispatching across the application.
 */

export const EMOTIONS = {
  IDLE: "idle",
  HAPPY: "happy",
  THINKING: "thinking",
  ENCOURAGED: "encouraging",
  CELEBRATING: "celebrating",
  CONCERNED: "concerned",
  SLEEPY: "sleepy",
  SURPRISED: "surprised",
};

export const EMOTION_LABELS = {
  idle: { label: "Idle / Ready", icon: "🤖", color: "cyan" },
  happy: { label: "Happy & Excited", icon: "🎉", color: "emerald" },
  thinking: { label: "Thinking & Analyzing", icon: "🤔", color: "amber" },
  encouraging: { label: "Encouraging Founder", icon: "✨", color: "sky" },
  celebrating: { label: "Milestone Celebration", icon: "🚀", color: "pink" },
  concerned: { label: "Concerned / Warning", icon: "⚠️", color: "rose" },
  sleepy: { label: "Sleepy / Standby", icon: "😴", color: "slate" },
  surprised: { label: "Impressed & Surprised", icon: "😮", color: "purple" },
};

class EmotionManager {
  constructor() {
    this.currentEmotion = EMOTIONS.IDLE;
    this.listeners = new Set();
    this.inactivityTimeout = null;
    this.resetTimer = null;
    this.INACTIVITY_DELAY = 45000; // 45 seconds to trigger sleepy mode

    this.setupInactivityTracker();
  }

  // Register state change listener
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.currentEmotion);
    return () => this.listeners.delete(callback);
  }

  // Set active emotion with optional auto-reset back to idle/contextual state
  setEmotion(emotion, autoResetDurationMs = 0) {
    if (!Object.values(EMOTIONS).includes(emotion)) return;

    this.currentEmotion = emotion;
    this.notify();

    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }

    if (autoResetDurationMs > 0 && emotion !== EMOTIONS.SLEEPY) {
      this.resetTimer = setTimeout(() => {
        this.currentEmotion = EMOTIONS.IDLE;
        this.notify();
      }, autoResetDurationMs);
    }

    this.resetInactivityTimer();
  }

  getEmotion() {
    return this.currentEmotion;
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.currentEmotion));
  }

  // Inactivity tracking logic
  setupInactivityTracker() {
    const activityEvents = ["pointermove", "keydown", "click", "scroll", "touchstart"];
    const handleUserActivity = () => {
      if (this.currentEmotion === EMOTIONS.SLEEPY) {
        this.setEmotion(EMOTIONS.HAPPY, 3000); // Wake up happy!
      }
      this.resetInactivityTimer();
    };

    if (typeof window !== "undefined") {
      activityEvents.forEach((evt) => {
        window.addEventListener(evt, handleUserActivity, { passive: true });
      });
      this.resetInactivityTimer();
    }
  }

  resetInactivityTimer() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    if (typeof window !== "undefined") {
      this.inactivityTimeout = setTimeout(() => {
        if (this.currentEmotion !== EMOTIONS.THINKING) {
          this.setEmotion(EMOTIONS.SLEEPY);
        }
      }, this.INACTIVITY_DELAY);
    }
  }
}

export const botEmotionManager = new EmotionManager();

// Helper global dispatcher function for custom events
export function triggerBotEmotion(emotion, durationMs = 0) {
  botEmotionManager.setEmotion(emotion, durationMs);
}
