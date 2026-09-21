# Digital Heroes 🦸

> A premium, production-quality web platform celebrating digital innovators, builders, and impact makers.

## ✨ Features

### Platform
- **Hero Profiles** — Rich profiles with skills, achievements, projects, and badges
- **Achievement System** — Categorized achievements with XP rewards and impact scores
- **Gamification** — XP, levels (1–20+), badges (Common → Legendary), level titles
- **Hero Discovery** — Search, filter by skill, sort by XP/level/impact/achievements
- **Dashboard** — Personal hero dashboard with radar chart, XP timeline, quick actions

### Design — "Digital Hero Aurora"
- Dark / Light mode with smooth transitions (persists preference)
- Aurora gradient backgrounds, glassmorphism, premium typography
- Framer Motion animations — scroll reveals, micro-interactions, page transitions
- Command Palette (`Ctrl+K`) for fast navigation
- Skeleton loading states, empty states, toast notifications
- Fully responsive — mobile, tablet, desktop, large screens

### Technical
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v3
- **Animations**: Framer Motion
- **Charts**: Recharts (area, radar)
- **State**: Zustand with persistence
- **Forms**: React Hook Form + Zod validation
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite via Prisma ORM
- **Auth**: JWT + bcrypt, protected routes
- **Security**: Helmet, CORS, rate limiting, Zod validation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

 Manual Setup

**1. Backend**
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

**2. Frontend** (new terminal)
```bash
cd client
npm install
npm run dev
```

**3. Open** → http://localhost:5173

---



---

## 📁 Project Structure

```
digital-heroes/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Design system (Button, Input, Modal, Badge...)
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   └── shared/        # CommandPalette
│   │   ├── pages/             # Landing, Explore, Heroes, HeroProfile, Dashboard...
│   │   ├── store/             # Zustand (auth, theme, toast)
│   │   ├── services/          # API clients (heroes, auth)
│   │   ├── hooks/             # useScrollReveal, useDebounce
│   │   ├── utils/             # helpers (XP, levels, formatting)
│   │   └── styles/            # globals.css (design tokens)
│
└── server/                    # Express + Prisma backend
    ├── src/
    │   ├── controllers/       # auth, hero, achievement, activity
    │   ├── services/          # Business logic layer
    │   ├── routes/            # API route definitions
    │   ├── middleware/        # auth, errorHandler
    │   ├── validators/        # Zod schemas
    │   └── utils/             # jwt, password, logger, prisma
    └── prisma/
        ├── schema.prisma      # DB schema (9 models)
        └── seed.ts            # Demo data (8 heroes, 29 achievements...)
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Health check | — |
| `POST` | `/api/auth/register` | Register new hero | — |
| `POST` | `/api/auth/login` | Sign in | — |
| `GET` | `/api/auth/me` | Get current user | ✅ |
| `GET` | `/api/heroes` | List heroes (search, filter, sort, paginate) | — |
| `GET` | `/api/heroes/top` | Top 6 heroes by XP | — |
| `GET` | `/api/heroes/stats` | Platform statistics | — |
| `GET` | `/api/heroes/:username` | Full hero profile | — |
| `PATCH` | `/api/heroes/me/profile` | Update profile | ✅ |
| `GET` | `/api/achievements` | List achievements (filter by category/hero) | — |
| `GET` | `/api/activities/:heroId` | Hero activity feed | — |

---



---

## 🛡️ Environment Variables

Server `.env` (already created):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 🚢 Production Notes

1. Replace `DATABASE_URL` with PostgreSQL connection string
2. Generate a strong `JWT_SECRET` (e.g., `openssl rand -hex 64`)
3. Run `npm run build` in both `client/` and `server/`
4. Serve `client/dist/` via nginx / Vercel / Netlify
5. Deploy server to Railway / Render / Fly.io

---

## 🦸 Hero Levels

| XP Range | Level | Title |
|---|---|---|
| 0–999 | 1–2 | Rising Hero |
| 1000–2999 | 3–4 | Emerging Hero |
| 3000–7999 | 5–7 | Established Hero |
| 8000–11999 | 8–11 | Notable Hero |
| 12000–15999 | 12–15 | Distinguished Hero |
| 16000–19999 | 16–19 | Elite Hero |
| 20000+ | 20+ | Legendary Hero |

---

Built with ❤️ for digital innovators.
