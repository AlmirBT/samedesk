# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FunTime HelpDesk** — SaaS-style frontend for a game server support system.
Frontend-only React app with dark theme and red accents. All data is mock/static — no backend.
Goal: look like a real $50+/mo SaaS product. Inspiration: Linear, Intercom, Crisp, Zendesk — but darker, redder, more animated.

## Tech Stack

- React 18 with React Router v6
- Tailwind CSS + CSS custom properties for theming
- framer-motion for all animations
- recharts for charts/graphs
- lucide-react for icons
- State: useState/useContext (or zustand)
- Fonts: Syne (headings), DM Sans (body), JetBrains Mono (mono) via Google Fonts

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server (Vite)
npm run build        # production build
npm run preview      # preview production build
```

## Architecture

- `src/pages/` — route-level page components (Login, Dashboard, Tickets, Tasks, Users, Roles, Tags, Shifts, Settings, Stats)
- `src/components/layout/` — Sidebar, TopBar, Layout wrapper
- `src/components/ui/` — reusable primitives (Button, Card, Modal, Toast, Badge, Avatar, StatusDot, TagChip, PriorityBar, PlatformIcon, SkeletonLoader)
- `src/components/tickets/` — ticket-specific components (TicketCard, TicketList, ChatView, ChatBubble, QuickReplyModal)
- `src/components/shifts/` — ShiftCard, ShiftTimer
- `src/components/stats/` — StatCard
- `src/data/mockData.js` — ALL mock data lives here (tickets, users, shifts, tags, roles, messages)
- `src/hooks/` — useAuth, useToast
- `src/context/AppContext.jsx` — global app state
- `src/styles/globals.css` — CSS variables and base styles

## Design Rules (STRICT)

### Color palette — use ONLY these values:
```
--red-primary: #E53E3E    --red-light: #FC8181    --red-dark: #C53030    --red-accent: #FEB2B2
--bg-base: #0D0D0D        --bg-surface: #161616   --bg-card: #1E1E1E     --bg-hover: #252525
--border: #2A2A2A         --text-primary: #F7FAFC  --text-secondary: #A0AEC0  --text-muted: #4A5568
--success: #48BB78        --warning: #ECC94B
```

### Forbidden:
- White or light backgrounds anywhere
- Purple/blue accents
- Inter, Roboto, Arial fonts
- Generic Bootstrap/Material UI look
- Flat buttons without hover/active states

### Required:
- Dark theme everywhere
- Red as the only accent color
- Glassmorphism for cards (`backdrop-filter: blur`)
- Syne for headings, DM Sans for body text
- Animations on all transitions and interactions

## Animation Rules

Use framer-motion everywhere:
```js
// Standard presets
fadeInUp:        { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
staggerContainer: { animate: { transition: { staggerChildren: 0.05 } } }
```

When to animate:
- Page mount → fadeInUp
- Lists → staggerChildren (50ms delay)
- Card hover → translateY(-2px) + stronger box-shadow
- Modals → scale(0.95→1) + opacity(0→1)
- Sidebar items → x(-8→0) on appear
- Numeric badges → scale(1.2→1) on update
- Toasts → x(100%→0) from right
- Always wrap animated lists in `AnimatePresence`

## Data Models

Key entities in mockData.js:
- **Ticket**: id, playerNick, platform (vk|telegram|discord|email), status (open|in_progress|closed|archived), priority (0-5), tags, messages
- **Message**: from (player|staff|bot|system), text, isInternal (true = staff-only internal chat)
- **User/Staff**: login, roles, status (online|offline|on_shift|break), isTrainee, stats
- **Shift**: startTime, endTime, staff list, payTokens, status (scheduled|active|ended)
- **Tag**: name, color, status (created|processed|custom), roles (who can see)

### Priority colors for PriorityBar:
```
0: #4A5568  1: #48BB78  2: #ECC94B  3: #ED8936  4: #E53E3E  5: #C53030
```

## Component Conventions

When creating any component:
1. Import `motion` from `framer-motion`
2. Add hover animation on all interactive elements
3. Use CSS variables from globals.css (not hardcoded colors)
4. Add skeleton loading state where data is "loading"
5. Never use `alert()` — use Toast component
6. Never use inline styles where CSS classes work
7. Always provide `key` prop in lists

### Button variants: primary | secondary | ghost | danger
### StatusDot: pulse animation for online/active states
### PlatformIcon: renders VK/Telegram/Discord/Email icons

## Development Phases

1. Layout + Sidebar + Login + Dashboard (required first)
2. Tickets list + chat view (required second)
3. Tasks + Users + Shifts
4. Roles + Tags + Settings + Stats
