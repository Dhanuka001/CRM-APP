const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const stages = [
    { name: 'Prospecting', order: 1 },
    { name: 'Qualification', order: 2 },
    { name: 'Proposal', order: 3 },
    { name: 'Negotiation', order: 4 },
    { name: 'Closed Won', order: 5, isFinal: true },
  ];

  await prisma.pipelineStage.createMany({
    data: stages,
    skipDuplicates: true,
  });

  await prisma.user.upsert({
    where: { email: 'admin@crm.local' },
    update: { name: 'System Admin', role: 'ADMIN' },
    create: {
      email: 'admin@crm.local',
      passwordHash: 'admin-placeholder-hash',
      name: 'System Admin',
      role: 'ADMIN',
    },
  });

  console.log('Seed data applied: pipeline stages + admin user.');
}

main()
  .catch((error) => {
    console.error('Prisma seed failed:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
