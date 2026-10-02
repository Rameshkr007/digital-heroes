# 🔌 DIGITAL HEROES — LEVEL 3 API BLUEPRINT & SPECIFICATION

## Base URLs
- **Development**: `http://localhost:4000/api`
- **Production Backend**: `https://digital-heroes-zutk.onrender.com/api`

---

## Endpoint Catalog

### 1. Level 3 Core & Intelligence (`/api/level3`)
- `GET /api/level3/ready` — System readiness health check (DB connectivity & uptime).
- `GET /api/level3/preferences` — Get AI memory & privacy preferences.
- `PATCH /api/level3/preferences` — Update user preferences.
- `POST /api/level3/preferences/clear-memory` — Wipe AI personalization context store.
- `POST /api/level3/copilot` — Grounded query to Personal AI Copilot ("MY DIGITAL HEROES AI").
- `GET /api/level3/journey` — Personal Journey Engine timeline & Next Best Action recommendation.
- `GET /api/level3/gamification/achievements` — List dynamic configurable achievements.
- `POST /api/level3/gamification/achievements` — Create admin achievement definition.
- `PATCH /api/level3/gamification/achievements/:id/toggle` — Toggle achievement status.
- `GET /api/level3/impact-ledger` — List verified factual impact ledger items.
- `GET /api/level3/events` — Stream smart domain event timeline.

### 2. Golf Performance Intelligence (`/api/golf`)
- `POST /api/golf/score` — Submit 18-hole score for AI validation & Stableford calculation.
- `GET /api/golf/performance` — Retrieve 5-score rolling average, consistency rating & trend.
- `GET /api/golf/coach` — AI Golf Performance Coach summary & personalized recommendations.

### 3. Charity & Impact Engine (`/api/charity`)
- `GET /api/charity/map` — Geo-coordinates and aggregated metrics for Impact Map.
- `GET /api/charity/impact` — User impact cards & allocation totals.

### 4. Transparent Draw Engine (`/api/draw`)
- `GET /api/draw/current` — Current active draw pool & prize pool details.
- `POST /api/draw/simulate` — Seeded draw algorithm simulation.
- `POST /api/draw/execute/:id` — Live draw execution & WebSockets event broadcast.

### 5. AI Admin Copilot & Security (`/api/admin`)
- `POST /api/admin/copilot` — Read-only database insights for admins.
- `GET /api/admin/anomalies` — Outlier score risk monitor.
- `GET /api/admin/audit` — Immutable audit log explorer.
- `GET /api/admin/flags` — Dynamic feature flags manager.
