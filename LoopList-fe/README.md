# LoopList - Social Streak Tracker for Micro-Habits

A Next.js frontend application for tracking micro-habits, building streaks, and sharing progress with others.

## Overview

LoopList helps users build better habits through:

- **Streak Tracking**: Visual representation of daily progress
- **Social Accountability**: Publicly shareable habit boards
- **Discoverability**: Find trending habits and clone them
- **Simple Interface**: Focus on consistency with minimal friction

## Features

- Create recurring micro-habits (loops) with customizable frequency
- Track daily progress and view streak statistics
- Browse trending and popular habits from other users
- Clone interesting habits to your own dashboard
- React or cheer others' public habits
- Heatmap visualization of your habit history

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based (mocked for frontend-only version)
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/looplist.git
cd looplist-fe
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
looplist-fe/
├── app/                # Next.js app directory
│   ├── components/     # Reusable UI components
│   ├── services/       # API services and data management
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   ├── explore/        # Explore public loops
│   ├── create/         # Create new loops
│   ├── clone/          # Clone existing loops
│   └── loop/           # Individual loop details
├── public/             # Static assets
└── ...config files
```

## Core Concepts

- **Loops**: Recurring micro-habits to be tracked daily
- **Streaks**: Consecutive days of completing a habit
- **Heatmap**: GitHub-like visualization of habit consistency
- **Cloning**: Copy a public habit to your own dashboard with optional modifications

## Development Notes

This is a frontend-only implementation with mocked backend services. In a production environment, the service classes would make actual API calls to a backend server. 