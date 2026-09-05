import React from "react";
import AIBotMascot from "./AIBot/AIBotMascot";

/**
 * InteractiveRoboAvatar wrapper for backward compatibility.
 * Maps legacy mood props ("waving", "thinking", "cheering", "hyper", "coffee", "hearts")
 * to the new 7 visual emotion states.
 */
export default function InteractiveRoboAvatar({
  mood = "waving",
  size = 78,
  onClick = null,
}) {
  const moodToEmotionMap = {
    waving: "happy",
    thinking: "thinking",
    cheering: "celebrating",
    hyper: "surprised",
    coffee: "sleepy",
    hearts: "encouraging",
    happy: "happy",
    concerned: "concerned",
  };

  const emotion = moodToEmotionMap[mood] || "happy";

  return <AIBotMascot emotion={emotion} size={size} onClick={onClick} />;
}
