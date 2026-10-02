# 🗄️ DIGITAL HEROES — LEVEL 3 DATABASE & SCHEMA DOCUMENTATION

## ORM & Database Architecture
- **ORM**: Prisma 5.22
- **Database Engine**: PostgreSQL (Production on Render) / SQLite (Local Development)

---

## Model Overview

| Model Name | Description | Key Indexes |
|---|---|---|
| `User` | Core user identity and role assignment | `email`, `username` |
| `HeroProfile` | Gamified hero profile (level, XP, impact score) | `level`, `xp` |
| `GolfScore` | 18-hole score entries with handicap & Stableford points | `userId`, `playedAt` |
| `Subscription` | Subscriptions with auto-renewal scheduling | `userId` |
| `Charity` | Verified charity partners with geo-location coords | `name` |
| `CharityContribution` | Subscription revenue allocations to charity partners | `userId`, `charityId` |
| `DrawPool` | Transparent prize pool draws | `status` |
| `DrawSimulation` | Seeded draw algorithm simulations | `drawId` |
| `AuditLog` | Audit records of system operations | `module`, `createdAt` |
| `UserPreference` | Privacy settings and AI memory context store | `userId` |
| `DomainEvent` | Immutable event log powered by Smart Event Engine | `eventType`, `createdAt` |
| `ConfigurableAchievement` | Dynamic admin-managed achievement definitions | `key` |
| `UserJourneyStep` | Personal Journey Engine milestone steps | `userId`, `stepKey` |
| `ImpactLedgerItem` | Factual verified impact disbursement records | `createdAt` |
| `IdempotencyRecord` | Replay protection for financial and draw calls | `key` |
