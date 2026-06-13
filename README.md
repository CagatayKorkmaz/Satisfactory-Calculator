# Satisfactory Planner

An interactive production line planner for Satisfactory, built on an infinite canvas. Plan and optimize your factory layouts with real-time calculations.

## Features

- **Infinite Canvas** — Drag, pan, zoom. Add production trees and text notes anywhere.
- **Dynamic Recipe Engine** — Select a target item and amount; the engine recursively builds the entire production tree with all required ingredients and machines.
- **Alternate Recipes** — Switch between standard and alternate recipes per item. The tree rebuilds dynamically.
- **Production Overrides** — Mark resources as "established" (already have them). The engine recalculates downstream requirements in real time.
- **Cascade Logic** — When you mark a child ingredient as established, its upstream dependencies are automatically marked too.
- **Scale to Capacity** — Right-click any ingredient or raw node to scale the entire tree to a target capacity.
- **Text Notes** — Add formatted notes with font, size, color, alignment, opacity, and embedded item icons.
- **Auto Layout** — Production trees are automatically laid out using the ELK layered graph algorithm.
- **Focus Mode** — Click any node or edge to highlight it and dim everything else.
- **Bulk Selection** — Toggle bulk select mode to select multiple nodes by dragging.
- **Persistent State** — Your canvas is automatically saved to localStorage and restored on reload.

## Tech Stack

- **React 19** — UI framework
- **ReactFlow (@xyflow/react)** — Infinite canvas with custom nodes
- **TailwindCSS 4** — Styling
- **ELKJS** — Graph layout algorithm
- **Vite** — Build tool

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/`.
