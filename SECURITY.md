# 🛡️ DIGITAL HEROES — LEVEL 3 SECURITY & PRIVACY SPECIFICATION

## Defense-in-Depth Architecture

1. **Server-Side Role-Based Access Control (RBAC)**:
   - Authorization is strictly enforced at the API controller layer (`authenticate` & `optionalAuth` middleware).
   - Frontend state never determines authorization.

2. **Idempotency & Replay Protection**:
   - Financial endpoints and live draw executions evaluate `X-Idempotency-Key` headers using `idempotency.middleware.ts` to prevent duplicate transactions.

3. **AI Safety & Privacy Architecture**:
   - Personal AI Copilot queries are strictly grounded on authorized user data retrieved server-side.
   - User AI memory store supports full **VIEW**, **EDIT**, and **CLEAR** actions via `preference.service.ts`.
   - Passwords, financial credentials, and personal contact details are strictly excluded from AI prompts and logs.

4. **Anomaly & Outlier Score Detection**:
   - Automated score variation checks flag rounds exceeding 12 strokes from 5-score rolling average for admin verification.

5. **Rate Limiting & Security Headers**:
   - Express rate limiting (`express-rate-limit`) caps request volume at 300 requests per 15-minute window.
   - Helmet HTTP headers (`helmet`) enforce strict security headers.
