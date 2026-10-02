import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function runSeed(prismaClient?: PrismaClient) {
  const prisma = prismaClient || new PrismaClient();
  console.log('🌱 Seeding Digital Heroes platform with Golf, Impact, Draw & Analytics data...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.drawSimulation.deleteMany();
  await prisma.drawPool.deleteMany();
  await prisma.charityContribution.deleteMany();
  await prisma.charity.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.golfScore.deleteMany();
  await prisma.featureFlag.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.heroBadge.deleteMany();
  await prisma.heroSkill.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.project.deleteMany();
  await prisma.heroProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.skill.deleteMany();

  // 1. Create Feature Flags
  const flags = [
    { key: 'ai_coach', enabled: true, description: 'AI Golf Performance Coach' },
    { key: 'draw_engine', enabled: true, description: 'Dynamic Draw Engine & Simulator Lab' },
    { key: 'impact_map', enabled: true, description: 'Interactive Impact Map & Charity Cards' },
    { key: 'notifications', enabled: true, description: 'Smart Notification Center' },
    { key: 'anomaly_detection', enabled: true, description: 'Fraud & Outlier Score Detection' },
  ];
  for (const f of flags) {
    await prisma.featureFlag.create({ data: f });
  }

  // 2. Create Badges
  const badges = await Promise.all([
    prisma.badge.create({ data: { name: '🏅 First Score', description: 'Submitted your first golf score', iconName: 'target', rarity: 'COMMON', requirement: 'Submit 1 valid score' } }),
    prisma.badge.create({ data: { name: '🔥 5-Score Streak', description: 'Submitted 5 scores in a row', iconName: 'flame', rarity: 'RARE', requirement: 'Submit 5 scores' } }),
    prisma.badge.create({ data: { name: '💚 Charity Champion', description: 'Contributed 50+ meals to charity', iconName: 'heart', rarity: 'EPIC', requirement: '50+ meals funded' } }),
    prisma.badge.create({ data: { name: '🎯 Consistency Hero', description: 'Achieved 85%+ score consistency index', iconName: 'award', rarity: 'EPIC', requirement: '85% consistency score' } }),
    prisma.badge.create({ data: { name: '🏆 Monthly Participant', description: 'Entered monthly transparent draw', iconName: 'trophy', rarity: 'RARE', requirement: 'Active subscription' } }),
    prisma.badge.create({ data: { name: '🌍 Impact Hero', description: 'Created measurable global impact', iconName: 'globe', rarity: 'LEGENDARY', requirement: 'Reach ₹10,000 contribution' } }),
  ]);

  // 3. Create Skills
  const skillsData = [
    { name: 'Swing Consistency', category: 'Golf', iconName: 'activity' },
    { name: 'Putting Precision', category: 'Golf', iconName: 'target' },
    { name: 'Stableford Scoring', category: 'Golf', iconName: 'bar-chart' },
    { name: 'React', category: 'Frontend', iconName: 'code' },
    { name: 'TypeScript', category: 'Languages', iconName: 'file-code' },
    { name: 'Node.js', category: 'Backend', iconName: 'server' },
    { name: 'Python AI', category: 'AI/ML', iconName: 'brain' },
  ];
  const skills = await Promise.all(skillsData.map(s => prisma.skill.create({ data: s })));

  // 4. Create Charities (Interactive Impact Map Data)
  const charitiesData = [
    {
      name: 'Akshaya Patra Midday Meals',
      category: 'Hunger & Education',
      description: 'Providing nutritious school meals to underprivileged children across India.',
      location: 'Bengaluru, India',
      lat: 12.9716,
      lng: 77.5946,
      totalRaised: 485000,
      mealsProvided: 19400,
      treesPlanted: 0,
      educationUnits: 1200,
      verified: true,
    },
    {
      name: 'GiveIndia Green Earth Initiative',
      category: 'Environment',
      description: 'Planting native trees to restore degraded forest land across Western Ghats.',
      location: 'Pune, India',
      lat: 18.5204,
      lng: 73.8567,
      totalRaised: 320000,
      mealsProvided: 0,
      treesPlanted: 6400,
      educationUnits: 0,
      verified: true,
    },
    {
      name: 'Delhi Child Literacy Mission',
      category: 'Education',
      description: 'Distributing STEM kits and digital devices to rural schools in North India.',
      location: 'New Delhi, India',
      lat: 28.6139,
      lng: 77.209,
      totalRaised: 290000,
      mealsProvided: 4500,
      treesPlanted: 0,
      educationUnits: 2900,
      verified: true,
    },
    {
      name: 'Global Hunger Relief Fund',
      category: 'Global Relief',
      description: 'Emergency food packets and clean water distribution for crisis areas.',
      location: 'London, UK',
      lat: 51.5074,
      lng: -0.1278,
      totalRaised: 650000,
      mealsProvided: 26000,
      treesPlanted: 1000,
      educationUnits: 3000,
      verified: true,
    },
  ];
  const charities = await Promise.all(charitiesData.map(c => prisma.charity.create({ data: c })));

  const defaultPassword = await bcrypt.hash('Hero@1234', 12);

  // 5. Hero Users
  const heroes = [
    { username: 'aarav_sharma', email: 'aarav@digitalhero.dev', displayName: 'Aarav Sharma', title: 'Scratch Golfer & Dev', location: 'Bengaluru, India', scores: [72, 74, 71, 73, 70, 69, 72, 71] },
    { username: 'ananya_iyer', email: 'ananya@digitalhero.dev', displayName: 'Ananya Iyer', title: 'Design & Golf Champion', location: 'Mumbai, India', scores: [84, 82, 85, 80, 79, 81, 78, 80] },
    { username: 'rohan_verma', email: 'rohan@digitalhero.dev', displayName: 'Rohan Verma', title: 'AI Engineer & Striker', location: 'New Delhi, India', scores: [78, 76, 79, 75, 74, 77, 73, 75] },
    { username: 'priya_sharma', email: 'priya@digitalhero.dev', displayName: 'Priya Sharma', title: 'Mobile Dev & Golfer', location: 'Bengaluru, India', scores: [88, 86, 84, 87, 83, 82, 85, 81] },
  ];

  for (const h of heroes) {
    const user = await prisma.user.create({
      data: {
        email: h.email,
        username: h.username,
        passwordHash: defaultPassword,
        role: 'USER',
        profile: {
          create: {
            displayName: h.displayName,
            title: h.title,
            bio: `Passionate about golf performance, tech innovation, and charity impact.`,
            location: h.location,
            level: 12,
            xp: 11500,
            totalImpact: 4500,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${h.username}&backgroundColor=b6e3f4`,
          },
        },
      },
      include: { profile: true },
    });

    // Subscriptions
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planName: 'Hero Pro Champion Plan',
        status: 'ACTIVE',
        priceMonthly: 999.0,
        currency: 'INR',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        nextRenewalAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Golf Scores
    for (let i = 0; i < h.scores.length; i++) {
      const s = h.scores[i];
      const isOutlier = i === 2 && s > 90; // outlier score test
      await prisma.golfScore.create({
        data: {
          userId: user.id,
          score: s,
          handicap: 4.5,
          stablefordPoints: Math.max(18, 54 - Math.floor(s / 2)),
          courseName: i % 2 === 0 ? 'Delhi Golf Club' : 'Karnataka Golf Association',
          isFlagged: isOutlier,
          flagReason: isOutlier ? 'Suspicious score variation (+12 strokes from 5-score average)' : '',
          playedAt: new Date(Date.now() - (7 - i) * 3 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Charity Contributions
    await prisma.charityContribution.create({
      data: {
        userId: user.id,
        charityId: charities[0].id,
        amount: 1500,
        mealsCount: 60,
        treesCount: 0,
        educationCount: 5,
        month: 'September 2026',
      },
    });

    // Notifications
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: '🏆 September Transparent Draw Entered',
        message: 'Your active subscription qualifies you for the ₹50,000 Hybrid Draw Pool.',
        type: 'DRAW',
      },
    });
  }

  // 6. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@digitalhero.dev',
      username: 'admin_hero',
      passwordHash: await bcrypt.hash('Admin@1234', 12),
      role: 'ADMIN',
      profile: {
        create: {
          displayName: 'Super Admin',
          title: 'Platform Administrator',
          level: 20,
          xp: 25000,
          totalImpact: 50000,
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=adminhero&backgroundColor=c0aede',
        },
      },
    },
  });

  // 7. Create Draw Pools & Simulations
  const draw = await prisma.drawPool.create({
    data: {
      title: 'September 2026 Champion Draw Pool',
      month: 'September 2026',
      status: 'OPEN',
      mode: 'HYBRID',
      prizePool: 75000.0,
      totalParticipants: 1420,
      seed: 'sec_seed_9824a71',
    },
  });

  await prisma.drawSimulation.create({
    data: {
      drawId: draw.id,
      mode: 'HYBRID',
      seed: 'sec_seed_9824a71',
      eligibleCount: 1420,
      prizePool: 75000.0,
      resultJson: JSON.stringify({
        selectedWinner: 'Aarav Sharma',
        weightFactor: 1.45,
        timestamp: new Date().toISOString(),
      }),
    },
  });

  // 8. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      username: 'admin_hero',
      action: 'DRAW_SIMULATION_EXECUTED',
      module: 'DRAW_ENGINE',
      details: 'Executed hybrid transparent draw simulation #001 with 1,420 eligible participants.',
    },
  });

  console.log('🎉 Full-stack Digital Heroes seed completed!');
  console.log('📋 Login Credentials:');
  console.log('  Admin User: admin@digitalhero.dev | Admin@1234');
  console.log('  Hero User:  aarav@digitalhero.dev | Hero@1234');
}
