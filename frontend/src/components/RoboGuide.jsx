import React from "react";
import AIBotContainer from "./AIBot/AIBotContainer";

/**
 * RoboGuide wrapper component.
 * Renders the cute, premium AI co-founder assistant mascot container.
 */
export default function RoboGuide({ go, current }) {
  return <AIBotContainer go={go} current={current} />;
}
