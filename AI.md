# 🧠 DIGITAL HEROES — LEVEL 3 AI ARCHITECTURE & RESILIENCE

## AI System Principles

1. **Strict Data Grounding**:
   - AI outputs are generated exclusively from real, authorized user data retrieved server-side (`getGolfPerformance`, `getUserImpact`, `getUserSubscription`, `getUserJourney`).
   - The AI never fabricates scores, financial amounts, or charity statistics.

2. **Explainability Layer ("Why am I seeing this?")**:
   - Every AI response includes data attribution and formula rationale.

3. **User Memory Control**:
   - Non-sensitive user preferences stored in `UserPreference.aiMemoryJson`.
   - Users can view, edit, or wipe memory at any time via `clearUserAIMemory`.

4. **Resilience & Graceful Fallback**:
   - If the AI service fails or encounters a timeout, the frontend catches the exception and displays:
     *"AI insights are temporarily unavailable. Core platform features remain fully operational."*
