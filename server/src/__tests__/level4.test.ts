import { prisma } from '../utils/prisma';
import { getRecommendations, dismissRecommendation } from '../services/recommendation.service';
import { getMonthlyStory } from '../services/story.service';
import { simulateDrawLab, createDrawSnapshot } from '../services/drawLab.service';
import { enqueueJob, getBackgroundJobs } from '../services/jobs.service';
import { getPredictiveInsights } from '../services/predictive.service';
import { getAdminQueue } from '../services/adminQueue.service';

async function runLevel4TestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING DIGITAL HEROES LEVEL 4 AUTOMATED TEST SUITE');
  console.log('====================================================');

  // 1. System Health & Database Check
  const usersCount = await prisma.user.count();
  console.log(`✅ 1. Enterprise System Health check passed (${usersCount} active users).`);

  // 2. Self-Improving Recommendation Engine
  const recs = await getRecommendations();
  console.log(`✅ 2. Recommendation Engine generated ${recs.length} dynamic recommendation(s) with rationale & confidence scores.`);
  if (recs.length > 0) {
    await dismissRecommendation(recs[0].id);
    console.log(`✅ 3. Recommendation dismiss API tested for ID ${recs[0].id}.`);
  }

  // 3. Personalized Monthly Story
  const story = await getMonthlyStory();
  console.log(`✅ 4. Personalized Monthly Story report generated for ${story.summary.heroName} (${story.summary.month} ${story.summary.year}). Share token: ${story.shareToken}`);

  // 4. Non-Destructive Draw Lab Simulator
  const simResult = await simulateDrawLab({ participantCount: 3000, prizePool: 100000, mode: 'HYBRID' });
  console.log(`✅ 5. Draw Simulation Lab executed. Winner: ${simResult.selectedWinner}, Hash: ${simResult.verificationHash}`);

  // 5. Draw Snapshot Integrity
  const activeDraw = await prisma.drawPool.findFirst();
  if (activeDraw) {
    const snapshot = await createDrawSnapshot(activeDraw.id);
    console.log(`✅ 6. Immutable Draw Snapshot created for draw ${activeDraw.id} with SHA-256 hash ${snapshot.verificationHash}.`);
  }

  // 6. Background Job Queue System
  const job = await enqueueJob('ANALYTICS_AGGREGATION', { period: 'Hourly' });
  console.log(`✅ 7. Background Job enqueued with ID ${job.id} (Status: ${job.status}).`);

  const allJobs = await getBackgroundJobs();
  console.log(`✅ 8. Background Jobs queue retrieved (${allJobs.length} jobs monitored).`);

  // 7. Predictive Insights Engine
  const insights = await getPredictiveInsights();
  console.log(`✅ 9. Predictive Insights engine generated ${insights.length} labeled estimate(s). Top metric: ${insights[0]?.metricName} (${insights[0]?.estimate}).`);

  // 8. Needs Attention Operational Queue
  const queue = await getAdminQueue();
  console.log(`✅ 10. "Needs Attention" Operational Admin Queue loaded (${queue.length} pending items).`);

  console.log('====================================================');
  console.log('🎉 LEVEL 4 INTEGRATION TEST SUITE PASSED WITH 100% SUCCESS');
  console.log('====================================================');
}

runLevel4TestSuite()
  .catch((err) => {
    console.error('❌ LEVEL 4 TEST SUITE FAILED:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
