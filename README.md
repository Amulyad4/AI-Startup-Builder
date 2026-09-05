# AI Startup Builder

A multi-agent AI SaaS platform that orchestrates specialized AI specialist agents (Idea Validation, Market Research, Competitor Moat, Customer Persona, Business Model, MVP Planning, Financial Modeling, Risk Assessment, Marketing Flywheel, Pitch Deck) to generate investor-ready blueprints in seconds.

## Project Structure

```
startup-builder/
├── frontend/             # React 18 + Vite frontend application
│   ├── src/
│   │   ├── components/   # UI components, neural agent matrix, AI bot mascot, animations
│   │   ├── context/      # Theme context (Dark / Light mode)
│   │   ├── pages/        # Landing, Auth, Intake, Selection, Dashboard/Results, History, Profile, Settings
│   │   ├── services/     # Multi-agent synthesis engine & Groq integration
│   │   └── constants/    # Agent definitions and color palettes
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json          # Root workspace scripts
└── README.md
```

## Quick Start

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Run local development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

## Features

- **Multi-Agent Specialist Swarm**: 10 specialist agents analyzing startup ideas across feasibility, TAM/SAM market sizing, unit economics, risk matrices, and 10-slide pitch decks.
- **Dynamic Idea Intake**: Streamlined single-concept input with auto-validation.
- **Interactive Workbench**: Real-time results thread, dynamic market charts, swarm console, and efficiency matrix.
- **History & Saved Blueprints**: Persistent local caching and execution history.
- **Export Capabilities**: 1-click export of investor blueprints in Formatted Text (`.txt`) and Markdown (`.md`).
- **Interactive AI Companion**: CYRA-1 AI Mascot with animated emotional feedback and contextual startup guidance.
