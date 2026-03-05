import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

export default async function Home() {
  const equipment = await prisma.equipment.findMany();
  const technicians = await prisma.technician.findMany();

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold underline">Tailwind Check</h1>
      <p className="mt-4 rounded-lg border p-4 shadow">
        If this looks big/bold/underlined with spacing, Tailwind is working!
      </p>
      <Button>Shadcn Button</Button>
      <h1 className="text-2xl font-bold">Seed Check</h1>

      <h2 className="mt-6 font-semibold">Equipment</h2>
      <pre>{JSON.stringify(equipment, null, 2)}</pre>

      <h2 className="mt-6 font-semibold">Technicians</h2>
      <pre>{JSON.stringify(technicians, null, 2)}</pre>
    </main>
  );
}
