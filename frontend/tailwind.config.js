/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bgSoft: 'var(--bg-soft)',
        surface: 'var(--surface)',
        surfaceAlt: 'var(--surface-alt)',
        border: 'var(--border)',
        borderContrast: 'var(--border-contrast)',
        text: 'var(--text)',
        textMuted: 'var(--text-muted)',
        primary: 'var(--primary)',
        primarySoft: 'var(--primary-soft)',
        accent: 'var(--accent)',
        accentSoft: 'var(--accent-soft)',
        cyberCyan: '#06B6D4',
        hyperViolet: '#A855F7',
        neonEmerald: '#10B981',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Syne', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cyber-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'cyber-violet': '0 0 25px -5px rgba(168, 85, 247, 0.3)',
        'cyber-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
