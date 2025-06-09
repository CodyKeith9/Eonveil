# Eonveil: The Gathering Storm

Eonveil is a live, multiplayer combat and roleplay system with its own custom mechanics, real-time stat tracking, chat, and lore management. It is actively in development and currently in production.

## Features

- Create or join private rooms using a unique room code
- Real-time Dice Roller synchronized across all players
- Live Character Stats interface (Mana, Stamina, Health, and more)
- Real-time chat with session history
- Interactive LoreBoard to explore the game’s mythology and factions
- Player roles include Dungeon Master (DM) and Player* — DM functionality is implemented in the backend but is currently hidden from the UI

## Technical Overview

- Built with React and Socket.IO for live communication
- Hosted via Render with automatic deployment from GitHub
- Currently mobile-compatible, but CSS is still being refined for full mobile support
- Lore content and game systems are modular and will later connect to MongoDB

## How the System Works

1. When a user creates a room, a unique room code is generated.
2. Anyone with the room code can join the session.
3. The first user to create the room is assigned the role of DM; all others are assigned as Player*.
4. Dice rolls, stat updates, and chat messages are synced in real time to all connected users.

## In Progress

- Expanding Dungeon Master capabilities (manual stat control, narrative tools)
- MongoDB integration for persistent data and saved character sessions
- Full CSS enhancements for mobile-first design
- Planning conversion into a full-featured application with monetization options

## Live Project Access

The site is actively deployed and viewable at:

https://eonveil-frontend.onrender.com

This is a production version of the application. Please be respectful when testing, as hosting costs are live and billed to the creator.

## Development Setup

To run locally for development:

```bash
git clone https://github.com/CodyKeith9/eonveil-frontend.git
cd eonveil-frontend
npm install
npm run dev
