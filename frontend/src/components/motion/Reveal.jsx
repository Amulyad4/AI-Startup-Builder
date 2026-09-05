import React from "react";
import { motion } from "framer-motion";

/**
 * Reveal — fades + rises an element into view as it enters the viewport.
 * Wrap any section/card in this for consistent, premium scroll motion.
 *
 * Props:
 *  - delay: seconds before animating (for manual stagger)
 *  - y: initial vertical offset in px
 *  - once: only animate the first time it enters view (default true)
 *  - as: element to render (default "div")
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  once = true,
  className = "",
  as = "div",
  ...rest
}) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Stagger — provides a staggered-children container. Use with StaggerItem,
 * or directly with motion children that read variants from context via
 * `variants={itemVariants}`.
 */
export function Stagger({ children, className = "", stagger = 0.08, delay = 0, once = true, ...rest }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function StaggerItem({ children, className = "", ...rest }) {
  return (
    <motion.div className={className} variants={itemVariants} {...rest}>
      {children}
    </motion.div>
  );
}
