import Link from "next/link";
import PoseImage from "@/components/PoseImage";
import { ButtonLink, Shell } from "@/components/ui";
import { catalog, suggestDeck } from "@/lib/catalog";
import { PLANS, brand } from "@/lib/brand";

const STEPS = [
  {
    n: "01",
    title: "Pick the frames you want",
    body:
      "Filter the library by who's in the frame, how tight it is, and where it " +
      "falls in the day. Drop the ones you want into a shoot.",
  },
  {
    n: "02",
    title: "Send your couple the link",
    body:
      "They open it on their phone — no app, no sign-up, no account. They swipe " +
      "through your picks and mark what they love.",
  },
  {
    n: "03",
    title: "Shoot the list they helped write",
    body:
      "Their answers come back as a short code. Paste it in and you have a shot " +
      "list nobody can argue with, ready to print.",
  },
];

export default function HomePage() {
  const hero = suggestDeck({ size: 6 });
  const pro = PLANS.pro;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <Shell className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14">
          <div className="animate-rise">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-accent">
              For wedding photographers
            </p>
            <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] sm:text-6xl">
              Stop guessing what
              <br />
              your couple wants.
            </h1>
            <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-ink-soft">
              Build the pose plan, send them a link, and let them tell you which
              frames they actually want. You walk into the day with a shot list
              they helped write — and {catalog.length} poses that tell you exactly
              what to say to get each one.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/studio/" size="lg" variant="ink">
                Plan a shoot — free
              </ButtonLink>
              <ButtonLink href="/poses/" size="lg" variant="outline">
                Browse the library
              </ButtonLink>
            </div>

            <p className="mt-4 text-[0.8rem] text-ink-faint">
              No account. Nothing to install. Your work stays on your device.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {hero.map((pose, i) => (
              <PoseImage
                key={pose.id}
                pose={pose}
                size="card"
                priority={i < 3}
                sizes="(min-width: 1024px) 15vw, 30vw"
                className={`aspect-[3/4] w-full rounded-xl ${
                  i % 2 === 1 ? "translate-y-4 sm:translate-y-6" : ""
                }`}
              />
            ))}
          </div>
        </Shell>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Shell>
          <h2 className="max-w-xl font-display text-3xl sm:text-4xl">
            The part everyone does badly, done once.
          </h2>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
            Right now this happens over three weeks of Pinterest links and
            screenshots, and on the day nobody remembers what was agreed.
          </p>

          <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((step) => (
              <li key={step.n}>
                <p className="font-display text-2xl text-accent">{step.n}</p>
                <h3 className="mt-2 text-[1.02rem] font-semibold">{step.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Shell>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Shell className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">
              Not a mood board. A script.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
              A reference photo tells you what the frame looks like. It doesn&apos;t
              help at minute forty of family formals when the light is going and
              nobody knows where to put their hands.
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
              Every pose here carries the sentence you say out loud, the light that
              makes it work, a focal length, and the mistake that ruins it.
            </p>
            <Link
              href="/poses/"
              className="mt-6 inline-flex text-[0.9rem] font-medium text-accent underline underline-offset-4"
            >
              Read a few →
            </Link>
          </div>

          <figure className="rounded-2xl border border-border bg-paper-raised p-6">
            <blockquote className="font-display text-[1.05rem] leading-relaxed">
              “{catalog[0]?.direction}”
            </blockquote>
            <figcaption className="mt-4 border-t border-border pt-4 text-[0.8rem] text-ink-soft">
              <span className="font-medium text-ink">{catalog[0]?.title}</span>
              {" · "}
              {catalog[0]?.lens}
            </figcaption>
          </figure>
        </Shell>
      </section>

      <section className="py-16 sm:py-20">
        <Shell className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl">
            Free until it&apos;s worth paying for.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[0.95rem] leading-relaxed text-ink-soft">
            The free plan runs a whole wedding: the full library, 35 poses with
            complete direction, and a client deck. Pro is ${pro.monthly} a month
            when you want the rest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/studio/" size="lg" variant="ink">
              Start free
            </ButtonLink>
            <ButtonLink href="/pricing/" size="lg" variant="outline">
              See what Pro adds
            </ButtonLink>
          </div>
        </Shell>
      </section>
    </>
  );
}
