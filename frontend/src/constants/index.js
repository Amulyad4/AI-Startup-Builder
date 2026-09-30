import { AGENT_META, getAgentColor } from "./agents";

export { AGENT_META, getAgentColor };

export const AGENTS = Object.keys(AGENT_META)
  .filter(key => key !== "supervisor")
  .map((key) => {
    const meta = AGENT_META[key];
    return {
      key: meta.id,
      name: meta.label,
      label: meta.label,
      tag: meta.tag,
      icon: meta.icon,
      colorLight: meta.colorLight,
      colorDark: meta.colorDark,
      rgb: meta.rgb,
      desc: meta.desc,
      avatarType: meta.avatarType,
      emoji: meta.emoji,
      category: meta.category,
      catchphrase: meta.catchphrase,
    };
  });

