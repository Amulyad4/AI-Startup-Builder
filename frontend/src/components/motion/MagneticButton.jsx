import React, { useRef } from "react";
import { motion } from "framer-motion";

/**
 * MagneticButton — the button subtly follows the cursor within its bounds
 * and springs back on leave. A small, tasteful detail that reads as
 * "high-end product" rather than a template. Falls back gracefully on
 * touch devices (no mousemove events fire, so it just behaves like a
 * normal button with a tap/hover scale).
 */
export default function MagneticButton({
  children,
  className = "",
  as = "button",
  strength = 14,
  ...rest
}) {
  const ref = useRef(null);
  const Component = motion[as] || motion.button;

  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    el.style.setProperty("--mx", `${(relX / rect.width) * strength}px`);
    el.style.setProperty("--my", `${(relY / rect.height) * strength}px`);
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", `0px`);
    el.style.setProperty("--my", `0px`);
  }

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      className={className}
      style={{
        transform: "translate(var(--mx, 0px), var(--my, 0px))",
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
