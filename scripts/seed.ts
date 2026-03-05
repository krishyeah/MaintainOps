import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // clear existing data
    await prisma.equipment.deleteMany();
    await prisma.equipment.deleteMany();

    await prisma.equipment.createMany({
        data: [
            {
                name: 'HVAC Unit A',
                assetTag: 'HVAC-001',
                location: 'B001-01',
                category: 'HVAC',
                criticality: 3,
            },
            {
                name: 'HVAC Unit B',
                assetTag: 'HVAC-002',
                location: 'B001-02',
                category: 'HVAC',
                criticality: 3,
            },
            {
                name: 'Water Pump 1',
                assetTag: 'WP-001',
                location: 'B001-03',
                category: 'Water',
                criticality: 2,
            }
        ]
    })
    await prisma.technician.createMany({
    data: [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        skills: ["HVAC", "Electrical"],
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        skills: ["Mechanical", "Water Systems"],
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });