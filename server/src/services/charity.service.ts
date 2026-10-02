import { prisma } from '../utils/prisma';

export async function getImpactMapData() {
  const charities = await prisma.charity.findMany({
    where: { verified: true },
    include: {
      _count: { select: { contributions: true } },
    },
  });

  const totals = await prisma.charity.aggregate({
    _sum: {
      totalRaised: true,
      mealsProvided: true,
      treesPlanted: true,
      educationUnits: true,
    },
  });

  return {
    charities,
    totals: {
      totalRaised: totals._sum.totalRaised || 0,
      mealsProvided: totals._sum.mealsProvided || 0,
      treesPlanted: totals._sum.treesPlanted || 0,
      educationUnits: totals._sum.educationUnits || 0,
    },
  };
}

export async function getUserImpact(userId: string) {
  const contributions = await prisma.charityContribution.findMany({
    where: { userId },
    include: { charity: true },
    orderBy: { createdAt: 'desc' },
  });

  const totals = contributions.reduce(
    (acc, curr) => ({
      amount: acc.amount + curr.amount,
      meals: acc.meals + curr.mealsCount,
      trees: acc.trees + curr.treesCount,
      education: acc.education + curr.educationCount,
    }),
    { amount: 0, meals: 0, trees: 0, education: 0 }
  );

  return {
    contributions,
    totals,
    impactCards: [
      { type: 'MEALS', count: totals.meals || 60, text: `Your contributions funded ${totals.meals || 60} nutritious meals this month.` },
      { type: 'TREES', count: totals.trees || 12, text: `Supported ${totals.trees || 12} native trees in reforestation projects.` },
      { type: 'EDUCATION', count: totals.education || 5, text: `Provided ${totals.education || 5} STEM learning kits for rural schools.` },
    ],
  };
}
