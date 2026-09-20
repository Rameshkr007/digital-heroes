import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Digital Heroes database...');

  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.heroBadge.deleteMany();
  await prisma.heroSkill.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.project.deleteMany();
  await prisma.heroProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.skill.deleteMany();

  // Create Badges
  const badges = await Promise.all([
    prisma.badge.create({ data: { name: 'Community Hero', description: 'Contributed meaningfully to the community', iconName: 'users', rarity: 'COMMON', requirement: 'Make 10 community contributions' } }),
    prisma.badge.create({ data: { name: 'Innovation Hero', description: 'Created groundbreaking solutions', iconName: 'lightbulb', rarity: 'RARE', requirement: 'Complete 5 innovation achievements' } }),
    prisma.badge.create({ data: { name: 'Consistency Hero', description: 'Shows up every day', iconName: 'calendar-check', rarity: 'RARE', requirement: 'Active for 30 consecutive days' } }),
    prisma.badge.create({ data: { name: 'Impact Hero', description: 'Created measurable real-world impact', iconName: 'trending-up', rarity: 'EPIC', requirement: 'Reach 1000 impact score' } }),
    prisma.badge.create({ data: { name: 'Rising Hero', description: 'Fast-growing new hero', iconName: 'rocket', rarity: 'COMMON', requirement: 'Reach Level 5 within 30 days' } }),
    prisma.badge.create({ data: { name: 'Code Wizard', description: 'Master of the digital craft', iconName: 'code-2', rarity: 'EPIC', requirement: 'Complete 20 technical achievements' } }),
    prisma.badge.create({ data: { name: 'Mentor Hero', description: 'Guided others on their journey', iconName: 'graduation-cap', rarity: 'RARE', requirement: 'Help 15 other heroes' } }),
    prisma.badge.create({ data: { name: 'Legend', description: 'A true Digital Hero Legend', iconName: 'crown', rarity: 'LEGENDARY', requirement: 'Reach Level 20' } }),
  ]);

  // Create Skills
  const skillsData = [
    { name: 'React', category: 'Frontend', iconName: 'code' },
    { name: 'TypeScript', category: 'Languages', iconName: 'file-code' },
    { name: 'Node.js', category: 'Backend', iconName: 'server' },
    { name: 'Python', category: 'Languages', iconName: 'terminal' },
    { name: 'UI/UX Design', category: 'Design', iconName: 'palette' },
    { name: 'Machine Learning', category: 'AI/ML', iconName: 'brain' },
    { name: 'DevOps', category: 'Infrastructure', iconName: 'cloud' },
    { name: 'GraphQL', category: 'Backend', iconName: 'share-2' },
    { name: 'Mobile Dev', category: 'Mobile', iconName: 'smartphone' },
    { name: 'Blockchain', category: 'Web3', iconName: 'link' },
    { name: 'Data Science', category: 'Data', iconName: 'bar-chart' },
    { name: 'Cybersecurity', category: 'Security', iconName: 'shield' },
    { name: 'Vue.js', category: 'Frontend', iconName: 'code' },
    { name: 'Rust', category: 'Languages', iconName: 'cpu' },
    { name: 'Docker', category: 'Infrastructure', iconName: 'box' },
  ];
  const skills = await Promise.all(skillsData.map(s => prisma.skill.create({ data: s })));

  const passwordHash = await bcrypt.hash('Hero@1234', 12);

  const heroesData = [
    {
      username: 'alex_chen',
      email: 'alex@digitalhero.dev',
      displayName: 'Alex Chen',
      title: 'Full-Stack Innovator',
      bio: 'Building the future of web, one commit at a time. Passionate about open source and developer tooling. Creator of 3 popular npm packages.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexchen&backgroundColor=b6e3f4',
      location: 'San Francisco, CA',
      website: 'https://alexchen.dev',
      github: 'alexchen',
      twitter: 'alexchen_dev',
      linkedin: 'alexchen',
      level: 12,
      xp: 11500,
      totalImpact: 1840,
      skills: [0, 1, 2, 7],
      skillProficiency: [95, 90, 85, 75],
      badgeIds: [0, 1, 3, 5],
      achievements: [
        { title: 'Open Source Champion', description: 'Published npm package with 5000+ weekly downloads', category: 'Innovation', iconName: 'package', xpReward: 500, impactScore: 350 },
        { title: 'Full-Stack Mastery', description: 'Built and deployed 10 production applications', category: 'Technical', iconName: 'layers', xpReward: 400, impactScore: 280 },
        { title: 'Community Builder', description: 'Organized first local dev meetup with 200+ attendees', category: 'Community', iconName: 'users', xpReward: 300, impactScore: 200 },
        { title: 'Hackathon Winner', description: 'First place at SF Hackathon 2024', category: 'Achievement', iconName: 'trophy', xpReward: 600, impactScore: 400 },
        { title: 'Code Reviewer', description: 'Reviewed 100+ pull requests for open source projects', category: 'Community', iconName: 'git-pull-request', xpReward: 200, impactScore: 150 },
      ],
      projects: [
        { title: 'DevFlow CLI', description: 'A powerful CLI tool for automating developer workflows', url: 'https://github.com/alexchen/devflow', tags: ['CLI', 'Node.js', 'TypeScript'], status: 'active' },
        { title: 'ReactQuery Pro', description: 'Advanced data fetching patterns for React applications', url: 'https://reactquerypro.dev', tags: ['React', 'TypeScript', 'OSS'], status: 'active' },
      ],
    },
    {
      username: 'sarah_nova',
      email: 'sarah@digitalhero.dev',
      displayName: 'Sarah Nova',
      title: 'Design Systems Architect',
      bio: 'Creating beautiful, accessible experiences that humans love. Lead designer at a unicorn startup. Speaker at design conferences worldwide.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarahnova&backgroundColor=ffd5dc',
      location: 'London, UK',
      website: 'https://sarahnova.design',
      github: 'sarahnova',
      twitter: 'sarah_nova_ux',
      linkedin: 'sarahnova',
      level: 14,
      xp: 13800,
      totalImpact: 2100,
      skills: [4, 1, 0],
      skillProficiency: [98, 80, 70],
      badgeIds: [1, 2, 3, 6],
      achievements: [
        { title: 'Design System Creator', description: 'Built a design system used by 50+ products', category: 'Innovation', iconName: 'layout', xpReward: 600, impactScore: 500 },
        { title: 'Accessibility Champion', description: 'Achieved WCAG AAA compliance across 20 products', category: 'Impact', iconName: 'eye', xpReward: 400, impactScore: 350 },
        { title: 'Conference Speaker', description: 'Keynote speaker at 3 international design conferences', category: 'Achievement', iconName: 'mic', xpReward: 500, impactScore: 300 },
        { title: 'Mentor of the Year', description: 'Mentored 25 junior designers to senior roles', category: 'Community', iconName: 'heart', xpReward: 450, impactScore: 400 },
      ],
      projects: [
        { title: 'Aurora Design System', description: 'Open source design system with 200+ components', url: 'https://aurora-ds.io', tags: ['Design', 'Figma', 'React'], status: 'active' },
        { title: 'A11y Toolkit', description: 'Accessibility testing and remediation toolkit', url: 'https://a11ytoolkit.dev', tags: ['Accessibility', 'React'], status: 'active' },
      ],
    },
    {
      username: 'marcus_dev',
      email: 'marcus@digitalhero.dev',
      displayName: 'Marcus Williams',
      title: 'AI/ML Pioneer',
      bio: 'Pushing the boundaries of machine intelligence. Research engineer by day, open-source contributor by night. Building tools that make AI accessible to everyone.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcusdev&backgroundColor=c0aede',
      location: 'Toronto, Canada',
      website: 'https://marcuswilliams.ai',
      github: 'marcusai',
      twitter: 'marcus_builds',
      linkedin: 'marcuswilliams',
      level: 16,
      xp: 15200,
      totalImpact: 2800,
      skills: [5, 10, 3, 2],
      skillProficiency: [96, 92, 88, 75],
      badgeIds: [1, 3, 5, 7],
      achievements: [
        { title: 'ML Research Paper', description: 'Published paper in top-tier ML conference with 500+ citations', category: 'Innovation', iconName: 'book-open', xpReward: 800, impactScore: 700 },
        { title: 'AI for Good', description: 'Built AI tool helping 10,000+ users with disabilities', category: 'Impact', iconName: 'heart', xpReward: 700, impactScore: 600 },
        { title: 'Open Source ML', description: 'Created ML framework with 10k+ GitHub stars', category: 'Community', iconName: 'star', xpReward: 600, impactScore: 500 },
        { title: 'Patent Holder', description: 'Awarded 2 patents for novel ML architectures', category: 'Innovation', iconName: 'award', xpReward: 900, impactScore: 800 },
        { title: 'Dataset Creator', description: 'Curated and published 3 public ML datasets used by researchers worldwide', category: 'Community', iconName: 'database', xpReward: 400, impactScore: 350 },
      ],
      projects: [
        { title: 'NeuralKit', description: 'Lightweight Python library for building neural networks', url: 'https://github.com/marcusai/neuralkit', tags: ['Python', 'ML', 'OSS'], status: 'active' },
        { title: 'VisionAssist', description: 'AI-powered visual assistance app for visually impaired users', url: 'https://visionassist.app', tags: ['AI', 'Mobile', 'Python'], status: 'active' },
      ],
    },
    {
      username: 'zara_builds',
      email: 'zara@digitalhero.dev',
      displayName: 'Zara Khan',
      title: 'Web3 Architect',
      bio: 'Decentralizing the future, one smart contract at a time. Ethereum core contributor and DeFi protocol architect. Believer in open, permissionless systems.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zarabuilds&backgroundColor=d1f4d1',
      location: 'Dubai, UAE',
      website: 'https://zarakhan.web3',
      github: 'zarakhan',
      twitter: 'zara_builds',
      linkedin: 'zarakhan',
      level: 11,
      xp: 10200,
      totalImpact: 1600,
      skills: [9, 1, 3, 11],
      skillProficiency: [94, 85, 80, 70],
      badgeIds: [0, 1, 4],
      achievements: [
        { title: 'Smart Contract Auditor', description: 'Audited 30+ smart contracts securing $500M+ in assets', category: 'Security', iconName: 'shield', xpReward: 500, impactScore: 450 },
        { title: 'DeFi Protocol Launch', description: 'Launched DeFi protocol with $10M+ TVL', category: 'Innovation', iconName: 'trending-up', xpReward: 700, impactScore: 600 },
        { title: 'Bug Bounty Hunter', description: 'Discovered critical vulnerabilities in 5 major protocols', category: 'Security', iconName: 'bug', xpReward: 600, impactScore: 400 },
      ],
      projects: [
        { title: 'SecureVault Protocol', description: 'Decentralized asset management protocol', url: 'https://securevault.finance', tags: ['Solidity', 'DeFi', 'Ethereum'], status: 'active' },
        { title: 'ChainAudit', description: 'Automated smart contract security analysis tool', url: 'https://chainaudit.dev', tags: ['Blockchain', 'Security', 'Python'], status: 'active' },
      ],
    },
    {
      username: 'jake_infinite',
      email: 'jake@digitalhero.dev',
      displayName: 'Jake Morrison',
      title: 'DevOps Craftsman',
      bio: 'Making deployments boring (in the best way). Kubernetes wizard and SRE practitioner. Reduced deployment times by 90% at 3 different companies.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jakeinfinite&backgroundColor=f4d4a8',
      location: 'Austin, TX',
      website: 'https://jakemorrison.io',
      github: 'jakemorrison',
      twitter: 'jake_devops',
      linkedin: 'jakemorrison',
      level: 10,
      xp: 9500,
      totalImpact: 1400,
      skills: [6, 14, 2],
      skillProficiency: [95, 90, 75],
      badgeIds: [0, 2, 4],
      achievements: [
        { title: 'Zero Downtime Champion', description: 'Achieved 99.99% uptime across 5 production systems', category: 'Technical', iconName: 'activity', xpReward: 500, impactScore: 450 },
        { title: 'CI/CD Pipeline Master', description: 'Built pipelines reducing deploy time from 45min to 3min', category: 'Innovation', iconName: 'git-branch', xpReward: 400, impactScore: 350 },
        { title: 'Cost Optimizer', description: 'Reduced cloud costs by 60% saving $2M annually', category: 'Impact', iconName: 'dollar-sign', xpReward: 600, impactScore: 500 },
      ],
      projects: [
        { title: 'K8s Dashboard Pro', description: 'Real-time Kubernetes cluster monitoring dashboard', url: 'https://github.com/jakemorrison/k8s-dashboard-pro', tags: ['Kubernetes', 'Go', 'React'], status: 'active' },
      ],
    },
    {
      username: 'priya_codes',
      email: 'priya@digitalhero.dev',
      displayName: 'Priya Sharma',
      title: 'Mobile Experience Engineer',
      bio: 'Crafting delightful mobile experiences for millions of users. React Native expert and performance optimization specialist.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priyacodes&backgroundColor=b6d4f4',
      location: 'Bangalore, India',
      website: 'https://priyasharma.dev',
      github: 'priyasharma',
      twitter: 'priya_mobile',
      linkedin: 'priyasharma',
      level: 9,
      xp: 8400,
      totalImpact: 1200,
      skills: [8, 0, 1, 4],
      skillProficiency: [93, 85, 82, 70],
      badgeIds: [0, 4, 6],
      achievements: [
        { title: 'App Store Feature', description: 'App featured on App Store in 12 countries', category: 'Achievement', iconName: 'star', xpReward: 500, impactScore: 400 },
        { title: 'Performance Hero', description: 'Improved app load time by 70% reaching sub-1s cold start', category: 'Technical', iconName: 'zap', xpReward: 400, impactScore: 350 },
        { title: 'Million Users', description: 'App crossed 1 million active users', category: 'Impact', iconName: 'users', xpReward: 700, impactScore: 600 },
      ],
      projects: [
        { title: 'SwiftMove', description: 'Fitness tracking app with AI coaching', url: 'https://swiftmove.app', tags: ['React Native', 'AI', 'Mobile'], status: 'active' },
      ],
    },
    {
      username: 'leo_security',
      email: 'leo@digitalhero.dev',
      displayName: 'Leo Zhang',
      title: 'Cybersecurity Specialist',
      bio: 'Protecting the digital world from threats. Red team lead and bug bounty hunter. Found critical vulnerabilities in Fortune 500 companies.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leosecurity&backgroundColor=f4b6b6',
      location: 'Singapore',
      website: 'https://leosec.xyz',
      github: 'leosec',
      twitter: 'leo_hacks',
      linkedin: 'leozhang',
      level: 13,
      xp: 12300,
      totalImpact: 1950,
      skills: [11, 3, 1],
      skillProficiency: [97, 85, 78],
      badgeIds: [0, 3, 5],
      achievements: [
        { title: 'Hall of Fame', description: 'Listed in security hall of fame for 10 major companies', category: 'Achievement', iconName: 'shield', xpReward: 600, impactScore: 500 },
        { title: 'Critical CVE', description: 'Discovered and responsibly disclosed 2 zero-day vulnerabilities', category: 'Security', iconName: 'alert-triangle', xpReward: 800, impactScore: 700 },
        { title: 'Security Training', description: 'Trained 500+ developers in secure coding practices', category: 'Community', iconName: 'book', xpReward: 400, impactScore: 350 },
      ],
      projects: [
        { title: 'PenTest Toolkit', description: 'Open source penetration testing automation toolkit', url: 'https://github.com/leosec/pentest-toolkit', tags: ['Python', 'Security', 'CLI'], status: 'active' },
      ],
    },
    {
      username: 'maya_data',
      email: 'maya@digitalhero.dev',
      displayName: 'Maya Rodriguez',
      title: 'Data Science Leader',
      bio: 'Turning data into decisions that matter. Lead data scientist building ML systems at scale. Passionate about data literacy and democratizing analytics.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mayadata&backgroundColor=e4d4f4',
      location: 'Barcelona, Spain',
      website: 'https://mayarodriguez.data',
      github: 'mayadata',
      twitter: 'maya_data_sci',
      linkedin: 'mayarodriguez',
      level: 11,
      xp: 10800,
      totalImpact: 1700,
      skills: [10, 5, 3],
      skillProficiency: [95, 88, 82],
      badgeIds: [1, 2, 6],
      achievements: [
        { title: 'Kaggle Grandmaster', description: 'Achieved Grandmaster rank on Kaggle', category: 'Achievement', iconName: 'award', xpReward: 700, impactScore: 600 },
        { title: 'Data Democracy', description: 'Built analytics dashboard used by 200+ non-technical users', category: 'Impact', iconName: 'bar-chart-2', xpReward: 400, impactScore: 350 },
        { title: 'ML in Production', description: 'Deployed 15 ML models serving 100M+ predictions daily', category: 'Technical', iconName: 'cpu', xpReward: 600, impactScore: 500 },
      ],
      projects: [
        { title: 'DataLens', description: 'No-code analytics platform for business users', url: 'https://datalens.io', tags: ['Python', 'React', 'ML'], status: 'active' },
      ],
    },
  ];

  // Create demo user account
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@digitalhero.dev',
      username: 'demo_hero',
      passwordHash: await bcrypt.hash('Demo@1234', 12),
      profile: {
        create: {
          displayName: 'Demo Hero',
          title: 'Rising Hero',
          bio: 'This is a demo account to explore Digital Heroes platform.',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demohero&backgroundColor=b6e3f4',
          level: 3,
          xp: 2400,
          totalImpact: 300,
        },
      },
    },
    include: { profile: true },
  });

  console.log('Created demo user:', demoUser.email);

  // Create heroes
  for (const heroData of heroesData) {
    const user = await prisma.user.create({
      data: {
        email: heroData.email,
        username: heroData.username,
        passwordHash,
        profile: {
          create: {
            displayName: heroData.displayName,
            title: heroData.title,
            bio: heroData.bio,
            avatarUrl: heroData.avatarUrl,
            location: heroData.location,
            website: heroData.website,
            github: heroData.github,
            twitter: heroData.twitter,
            linkedin: heroData.linkedin,
            level: heroData.level,
            xp: heroData.xp,
            totalImpact: heroData.totalImpact,
          },
        },
      },
      include: { profile: true },
    });

    const profile = user.profile!;

    // Add skills
    for (let i = 0; i < heroData.skills.length; i++) {
      const skillIndex = heroData.skills[i];
      await prisma.heroSkill.create({
        data: {
          heroId: profile.id,
          skillId: skills[skillIndex].id,
          proficiency: heroData.skillProficiency[i],
          endorsements: Math.floor(Math.random() * 50),
        },
      });
    }

    // Add achievements
    for (const ach of heroData.achievements) {
      await prisma.achievement.create({
        data: {
          heroId: profile.id,
          title: ach.title,
          description: ach.description,
          category: ach.category,
          iconName: ach.iconName,
          xpReward: ach.xpReward,
          impactScore: ach.impactScore,
          isVerified: true,
          achievedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Add badges
    for (const badgeIndex of heroData.badgeIds) {
      await prisma.heroBadge.create({
        data: {
          heroId: profile.id,
          badgeId: badges[badgeIndex].id,
          earnedAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Add projects
    for (const proj of heroData.projects) {
      await prisma.project.create({
        data: {
          heroId: profile.id,
          title: proj.title,
          description: proj.description,
          url: proj.url,
          tags: JSON.stringify(proj.tags),
          status: proj.status,
        },
      });
    }

    // Add activities
    const activityTypes = ['achievement', 'project', 'milestone', 'skill'];
    for (let i = 0; i < 5; i++) {
      await prisma.activity.create({
        data: {
          userId: user.id,
          heroId: profile.id,
          type: activityTypes[i % 4],
          content: [
            `Earned achievement: ${heroData.achievements[0]?.title || 'First Steps'}`,
            `Launched new project: ${heroData.projects[0]?.title || 'Side Project'}`,
            `Reached Level ${heroData.level}`,
            `Gained ${Math.floor(Math.random() * 100) + 50} XP from community contributions`,
            `Endorsed by 5 heroes for ${skillsData[heroData.skills[0]]?.name || 'their skills'}`,
          ][i],
          metadata: JSON.stringify({ xp: Math.floor(Math.random() * 200) + 50 }),
          createdAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000),
        },
      });
    }

    console.log(`✅ Created hero: ${heroData.displayName}`);
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Demo Accounts:');
  console.log('  Email: demo@digitalhero.dev | Password: Demo@1234');
  console.log('  Email: alex@digitalhero.dev | Password: Hero@1234');
  console.log('  (All hero accounts use password: Hero@1234)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
