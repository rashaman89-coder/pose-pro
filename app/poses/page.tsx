import PoseCard from "@/components/PoseCard";
import { poses } from "@/lib/data";

export default function PosesPage({ searchParams }: { searchParams: { category?: string; q?: string; }}) {
  const list = poses.filter(p => !searchParams.category || p.category === searchParams.category);
  const title = searchParams.category ? `Poses — ${searchParams.category}` : "All Poses";
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map(p => <PoseCard key={p.id} pose={p} />)}
      </div>
    </main>
  );
}
