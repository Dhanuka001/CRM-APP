const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const [users, leads, stages] = await Promise.all([
    prisma.user.findMany({ take: 5 }),
    prisma.lead.findMany({
      include: {
        owner: true,
        stage: true,
        tasks: true,
      },
      take: 5,
    }),
    prisma.pipelineStage.findMany({ orderBy: { order: 'asc' } }),
  ]);

  console.log(`Fetched ${users.length} users, ${leads.length} leads, ${stages.length} pipeline stages.`);
  if (leads.length) {
    console.log('Lead sample:', {
      title: leads[0].title,
      ownerEmail: leads[0].owner?.email || 'none',
      stage: leads[0].stage?.name || 'none',
    });
  }
}

main()
  .catch((error) => {
    console.error('Prisma connectivity check failed:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
