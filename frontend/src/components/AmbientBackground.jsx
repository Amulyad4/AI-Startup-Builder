import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function AmbientBackground() {
  const canvasRef = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("pointermove", handleMouseMove);

    // Soft, subtle ambient particle drift setup
    const particleCount = Math.min(55, Math.floor((width * height) / 24000));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: Math.random() * 0.35 + 0.15, // Slow, graceful floating velocity
        vx: (Math.random() - 0.5) * 0.2,
        length: Math.random() * 12 + 6,
        size: Math.random() * 1.5 + 1.0,
        colorType: Math.floor(Math.random() * 4), // Cyan, Indigo, Violet, Emerald
        opacity: Math.random() * 0.20 + 0.10, // Soft ambient opacity
      });
    }

    let gridOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Elegant Subtle Palette
      const cyan = dark ? "rgba(6, 182, 212, " : "rgba(8, 145, 178, ";
      const indigo = dark ? "rgba(99, 102, 241, " : "rgba(79, 70, 229, ";
      const violet = dark ? "rgba(168, 85, 247, " : "rgba(147, 51, 234, ";
      const emerald = dark ? "rgba(16, 185, 129, " : "rgba(5, 150, 105, ";
      const palette = [cyan, indigo, violet, emerald];

      // Subtle Perspective Grid Lines
      gridOffset = (gridOffset + 0.15) % 40;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = dark ? "rgba(6, 182, 212, 0.04)" : "rgba(79, 70, 229, 0.03)";

      for (let x = 0; x < width; x += 45) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = gridOffset; y < height; y += 45) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Soft Mouse Spotlight Glow
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 380);
      grad.addColorStop(0, dark ? "rgba(6, 182, 212, 0.08)" : "rgba(79, 70, 229, 0.05)");
      grad.addColorStop(0.5, dark ? "rgba(168, 85, 247, 0.03)" : "rgba(8, 145, 178, 0.02)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render Soft Floating Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const colorStr = palette[p.colorType];

        // Draw soft glowing trail line
        const lineGrad = ctx.createLinearGradient(p.x, p.y - p.length, p.x, p.y);
        lineGrad.addColorStop(0, "transparent");
        lineGrad.addColorStop(1, colorStr + p.opacity + ")");
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.length);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Draw soft glowing head dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = colorStr + (p.opacity * 1.5) + ")";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dark]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg transition-colors duration-500">
      {/* HTML5 Canvas Falling Particle & Grid Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Elegant Soft Glowing Auroras */}
      <div
        className="absolute -top-36 -left-36 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 dark:opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 75%)",
        }}
      />
      <div
        className="absolute top-1/2 -right-36 w-[550px] h-[550px] rounded-full blur-[130px] opacity-20 dark:opacity-12 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 75%)",
        }}
      />

      {/* Dot Matrix Texture Overlay */}
      <div className="absolute inset-0 bg-dot-texture opacity-10 pointer-events-none" />
    </div>
  );
}
