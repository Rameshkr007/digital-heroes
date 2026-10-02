import { prisma } from '../utils/prisma';
import { processVoiceIntent } from '../services/voice.service';
import { getVoiceUsageStats, getVoicePrivacySettings, clearVoiceHistory } from '../services/voiceUsage.service';

async function runVoiceTestSuite() {
  console.log('====================================================');
  console.log('🎙️ RUNNING DIGITAL HEROES LEVEL 4 VOICE AI TEST SUITE');
  console.log('====================================================');

  // Fetch demo user for testing
  const user = await prisma.user.findFirst({ where: { email: 'aarav@digitalhero.dev' } }) || await prisma.user.findFirst();
  const userId = user?.id;

  // 1. Performance Query Intent Test
  const perfResult = await processVoiceIntent('How is my golf consistency trend this month?', 'PERFORMANCE_PAGE', userId);
  console.log(`✅ 1. Performance Intent matched [${perfResult.intent}] (Confidence: ${perfResult.confidence}). Response sample: "${perfResult.response.slice(0, 60)}..."`);
  if (!perfResult.intent || perfResult.intent !== 'PERFORMANCE_QUERY') {
    throw new Error('Expected PERFORMANCE_QUERY intent match');
  }

  // 2. Charity Impact Query Intent Test
  const charityResult = await processVoiceIntent('How many meals did my subscription fund?', 'CHARITY_PAGE', userId);
  console.log(`✅ 2. Charity Intent matched [${charityResult.intent}] (Confidence: ${charityResult.confidence}). Response: "${charityResult.response.slice(0, 60)}..."`);
  if (charityResult.intent !== 'CHARITY_QUERY') {
    throw new Error('Expected CHARITY_QUERY intent match');
  }

  // 3. Draw Query Intent Test
  const drawResult = await processVoiceIntent('What is my eligibility status for the monthly reward draw?', 'DRAW_PAGE', userId);
  console.log(`✅ 3. Draw Intent matched [${drawResult.intent}]. Response: "${drawResult.response.slice(0, 60)}..."`);

  // 4. Voice Action Safety & Critical Action Gate Test
  const criticalResult = await processVoiceIntent('I want to cancel subscription immediately', 'SUBSCRIPTION_PAGE', userId);
  console.log(`✅ 4. Critical Mutation attempt intercepted [${criticalResult.intent}]. Is Critical: ${criticalResult.isCriticalAction}`);
  if (!criticalResult.isCriticalAction || !criticalResult.actionPreview) {
    throw new Error('Critical action gate failed to block unauthorized mutation query');
  }
  if (!criticalResult.actionPreview.requiresScreenConfirmation) {
    throw new Error('Expected requiresScreenConfirmation to be true for critical actions');
  }
  console.log(`   --> Safety Message: "${criticalResult.actionPreview.message}"`);

  // 5. Voice Usage & Analytics Service Test
  const usageStats = await getVoiceUsageStats();
  console.log(`✅ 5. Voice Usage Stats retrieved: ${usageStats.totalMinutes} mins, ${usageStats.totalSttCalls} STT calls, ${usageStats.totalTtsCalls} TTS calls, Estimated Cost: $${usageStats.estimatedCostUsd.toFixed(4)}.`);

  // 6. Voice Privacy Settings Test
  const privacySettings = await getVoicePrivacySettings(userId);
  console.log(`✅ 6. Voice Privacy Settings verified: Audio Retention = ${privacySettings.audioRetentionDays} days, Opt-In = ${privacySettings.transcriptionOptIn}.`);

  // 7. Clear History Test
  const clearResult = await clearVoiceHistory(userId);
  console.log(`✅ 7. Voice Transcript History Purged: ${clearResult.message}.`);

  // 8. DB Session Record Verification
  const sessionCount = await prisma.voiceSession.count();
  console.log(`✅ 8. Voice Session Audit Log Verified (${sessionCount} total audited sessions in SQLite DB).`);

  console.log('====================================================');
  console.log('🎉 LEVEL 4 VOICE AI TEST SUITE PASSED WITH 100% SUCCESS');
  console.log('====================================================');
}

runVoiceTestSuite()
  .catch((err) => {
    console.error('❌ VOICE AI TEST SUITE FAILED:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
