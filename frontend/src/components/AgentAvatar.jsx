import React from "react";
import supervisorImg from "../assets/agents/supervisor.png";
import ideaImg from "../assets/agents/idea.png";
import marketImg from "../assets/agents/market.png";
import rivalImg from "../assets/agents/rival.png";
import personaImg from "../assets/agents/persona.png";
import modelImg from "../assets/agents/model.png";
import mvpImg from "../assets/agents/mvp.png";
import coinImg from "../assets/agents/coin.png";
import sentinelImg from "../assets/agents/sentinel.png";
import signalImg from "../assets/agents/signal.png";
import deckImg from "../assets/agents/deck.png";

/**
 * AgentAvatar
 * 
 * High-fidelity 3D character avatars for all 11 AI specialists.
 * Uses the exact 3D render assets requested by the user:
 * - Supervisor: Glowing Blue Orb Core Bot
 * - Idea: Blue Cyber Owl
 * - Market: Holographic Earth Globe
 * - Rival: Orange Antenna Robot
 * - Persona: Cosmic Purple Spirit Alien
 * - Model: Isometric Glowing Blue Cube
 * - MVP: Lime Green Builder Robot
 * - Coin: Golden 3D Dollar Coin with sparkles
 * - Sentinel: Crimson Cyber Shield with eyes
 * - Signal: Pink Rocket Ship
 * - Deck: Purple DJ Robot with Headphones
 */
const AVATAR_MAP = {
  // Supervisor
  supervisor: supervisorImg,
  orchestrator: supervisorImg,

  // Idea Validator
  owl: ideaImg,
  idea: ideaImg,
  ideaValidation: ideaImg,

  // Market Scout
  globe: marketImg,
  market: marketImg,
  marketResearch: marketImg,

  // Rival Radar
  radar: rivalImg,
  rival: rivalImg,
  competitorAnalysis: rivalImg,

  // Persona Weaver
  persona: personaImg,
  customerPersona: personaImg,

  // Model Architect
  cube: modelImg,
  model: modelImg,
  businessModel: modelImg,

  // MVP Forge
  builder: mvpImg,
  mvp: mvpImg,
  mvpPlanning: mvpImg,

  // Coin Oracle
  coin: coinImg,
  financial: coinImg,
  financialPlanning: coinImg,

  // Sentinel
  sentinel: sentinelImg,
  risk: sentinelImg,
  riskAssessment: sentinelImg,

  // Signal Booster
  rocket: signalImg,
  signal: signalImg,
  marketingStrategy: signalImg,

  // Deck Maestro
  maestro: deckImg,
  deck: deckImg,
  pitchDeck: deckImg,
};

export default function AgentAvatar({ type = "supervisor", size = 48, className = "" }) {
  const imgSrc = AVATAR_MAP[type] || AVATAR_MAP.supervisor;

  return (
    <div
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center shrink-0 relative transition-transform duration-300 ${className}`}
    >
      <img
        src={imgSrc}
        alt={type}
        className="w-full h-full object-contain pointer-events-none select-none rounded-full"
        draggable={false}
      />
    </div>
  );
}
