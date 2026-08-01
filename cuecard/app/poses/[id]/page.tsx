import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PoseImage from "@/components/PoseImage";
import PoseNotes from "@/components/PoseNotes";
import { ButtonLink, Shell } from "@/components/ui";
import { catalog, label, poseById } from "@/lib/catalog";
import { brand } from "@/lib/brand";

/**
 * One indexable page per pose. This is the traffic engine: photographers search
 * for very specific things ("how to pose a groom half body", "back to back
 * wedding pose"), and 95 focused pages answer far more of those queries than
 * one gallery ever could.
 */

export function generateStaticParams() {
  return catalog.map((pose) => ({ id: pose.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pose = poseById(id);
  if (!pose) return { title: "Pose not found" };

  // The direction text makes a far better search snippet than any summary we
  // could write, because it's the exact thing the searcher wants.
  const description = pose.direction
    ? `${pose.direction.slice(0, 155).trim()}…`
    : `${label("subject", pose.subject)} wedding pose — ${pose.lens}.`;

  return {
    title: pose.title,
    description,
    alternates: { canonical: `${brand.url}/poses/${pose.id}/` },
    openGraph: {
      title: `${pose.title} — ${brand.name}`,
      description,
      images: [{ url: `${brand.url}${pose.image.card}` }],
      type: "article",
    },
  };
}

export default async function PosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pose = poseById(id);
  if (!pose) notFound();

  // Nearest neighbours by subject and framing keep crawlers moving through the
  // library instead of hitting one page and leaving.
  const related = catalog
    .filter(
      (p) =>
        p.id !== pose.id &&
        (p.subject === pose.subject || p.moment === pose.moment),
    )
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: pose.title,
    description: pose.direction,
    image: `${brand.url}${pose.image.full}`,
    tool: pose.lens,
    step: [
      { "@type": "HowToStep", text: pose.direction },
      { "@type": "HowToStep", text: pose.lighting },
    ].filter((s) => s.text),
  };

  return (
    <Shell className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-[0.82rem] text-ink-soft">
        <Link href="/poses/" className="hover:text-ink">
          Pose library
        </Link>
        <span className="mx-2 text-ink-faint">/</span>
        <span>{pose.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <PoseImage
          pose={pose}
          size="full"
          priority
          className="aspect-[3/4] w-full rounded-2xl"
          sizes="(min-width: 1024px) 46vw, 100vw"
        />

        <div>
          <h1 className="font-display text-3xl sm:text-4xl">{pose.title}</h1>
          <p className="mt-2.5 text-[0.85rem] text-ink-soft">
            {label("subject", pose.subject)} · {label("framing", pose.framing)} ·{" "}
            {label("moment", pose.moment)} · {label("difficulty", pose.difficulty)}
          </p>

          <PoseNotes pose={pose} />

          {pose.tags.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-1.5">
              {pose.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-paper-sunk px-2.5 py-1 text-[0.72rem] text-ink-soft"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-9 rounded-2xl border border-border p-5">
            <p className="text-[0.9rem] leading-relaxed text-ink-soft">
              Put this in a shoot, then send your couple a link and let them tell
              you whether they want it.
            </p>
            <ButtonLink href="/studio/" className="mt-4">
              Plan a shoot — free
            </ButtonLink>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl">Similar frames</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/poses/${p.id}/`}
                className="group overflow-hidden rounded-2xl border border-border"
              >
                <PoseImage
                  pose={p}
                  size="thumb"
                  className="aspect-[3/4] w-full"
                  sizes="(min-width: 640px) 25vw, 50vw"
                />
                <p className="p-3 text-[0.82rem] font-medium leading-snug group-hover:text-accent">
                  {p.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}
