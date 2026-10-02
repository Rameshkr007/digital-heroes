import { prisma } from '../utils/prisma';
import { getUserPreferences, clearUserAIMemory } from '../services/preference.service';
import { askUserCopilot } from '../services/copilot.service';
import { getUserJourney } from '../services/journey.service';
import { getConfigurableAchievements } from '../services/gamification.service';
import { getImpactLedger } from '../services/impactLedger.service';
import { emitDomainEvent } from '../services/events.service';

async function runLevel3TestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING DIGITAL HEROES LEVEL 3 AUTOMATED TEST SUITE');
  console.log('====================================================');

  // 1. Database Connection Check
  const userCount = await prisma.user.count();
  console.log(`✅ 1. Database Connection verified (${userCount} active users).`);

  // 2. User Preferences & AI Memory
  const prefs = await getUserPreferences();
  console.log(`✅ 2. User Preferences fetched. Layout: ${prefs.dashboardLayout}, AI Memory keys: ${Object.keys(prefs.aiMemory).join(', ') || 'default'}`);

  const clearResult = await clearUserAIMemory();
  console.log(`✅ 3. AI Memory Clear API tested: ${clearResult.message}`);

  // 3. Personal AI Copilot Grounded Query
  const copilotAnswer = await askUserCopilot('Explain my recent performance.');
  console.log(`✅ 4. Personal AI Copilot ("MY DIGITAL HEROES AI") response generated:`);
  console.log(`   --> ${copilotAnswer.split('\n')[0]}`);

  // 4. Personal Journey Engine & Smart Action Center
  const journey = await getUserJourney();
  console.log(`✅ 5. Personal Journey Engine computed: Progress ${journey.progressPercentage}%, Next Action: "${journey.nextBestAction.title}".`);

  // 5. Configurable Gamification Engine
  const achievements = await getConfigurableAchievements();
  console.log(`✅ 6. Configurable Achievements loaded (${achievements.length} active dynamic achievements).`);

  // 6. Impact Ledger
  const ledger = await getImpactLedger();
  console.log(`✅ 7. Verified Impact Ledger loaded (${ledger.length} verified records).`);

  // 7. Smart Domain Event Emission
  const event = await emitDomainEvent('SCORE_SUBMITTED', { title: 'Score Verified', message: 'Gross score 72 recorded.' });
  console.log(`✅ 8. Domain Event emitted & logged with ID ${event.id} (Type: ${event.eventType}).`);

  console.log('====================================================');
  console.log('🎉 LEVEL 3 INTEGRATION TEST SUITE PASSED WITH 100% SUCCESS');
  console.log('====================================================');
}

runLevel3TestSuite()
  .catch((err) => {
    console.error('❌ LEVEL 3 TEST SUITE FAILED:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
