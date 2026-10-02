# 🧪 DIGITAL HEROES — LEVEL 3 TESTING SPECIFICATION

## Test Execution

To execute the automated Level 3 integration test suite:

```bash
cd server
npx tsx src/__tests__/level3.test.ts
```

---

## Test Suite Coverage

1. **Database Readiness & Connection**:
   - Validates active database queries on `User` table.

2. **User Preferences & AI Memory**:
   - Tests `getUserPreferences` and verifies `clearUserAIMemory` wipe operations.

3. **Personal AI Copilot ("MY DIGITAL HEROES AI")**:
   - Tests grounded response generation with authorized data retrieval.

4. **Personal Journey Engine & Smart Action Center**:
   - Verifies step completion percentage and dynamic Next Best Action rationale.

5. **Configurable Gamification Engine**:
   - Validates seeding and listing of dynamic achievement definitions.

6. **Verified Impact Ledger**:
   - Validates retrieval of factual, auditable charity disbursement receipts.

7. **Smart Domain Event Emission**:
   - Tests domain event emission, WebSockets payload broadcasting, and automatic step progression.
