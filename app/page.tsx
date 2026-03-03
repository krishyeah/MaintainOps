import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold underline">Tailwind Check</h1>
      <p className="mt-4 rounded-lg border p-4 shadow">
        If this looks big/bold/underlined with spacing, Tailwind is working!
      </p>
      <Button>Shadcn Button</Button>
    </main>
  );
}
