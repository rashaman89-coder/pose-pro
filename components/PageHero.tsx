import { Sparkles } from "lucide-react";

export default function PageHero({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 pb-16 pt-16 sm:pb-20 sm:pt-24">
      <div className="absolute inset-0 bg-grid-dark [background-size:38px_38px] opacity-50" />
      <div className="glow-blob h-80 w-80 bg-brand-600/30" style={{ top: "-80px", left: "-40px" }} />
      <div className="glow-blob h-72 w-72 bg-cyanx-500/20" style={{ top: "0", right: "-60px" }} />
      <div className="container-x relative z-10 max-w-3xl">
        <span className="eyebrow-dark">
          <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">{title}</h1>
        {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{sub}</p>}
      </div>
    </section>
  );
}
