import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Talk to an ELD Specialist",
  description:
    "Talk to an AI ELD specialist about pricing, hardware and monitoring. Call (307) 452-0669 or email sales@ai-eld.com. Start your free 14-day trial today.",
};

const DETAILS = [
  { icon: Phone, label: "Sales", value: "(307) 452-0669", href: "tel:+13074520669" },
  { icon: Mail, label: "Sales email", value: "sales@ai-eld.com", href: "mailto:sales@ai-eld.com" },
  { icon: Mail, label: "Support email", value: "support@ai-eld.com", href: "mailto:support@ai-eld.com" },
  { icon: MapPin, label: "Location", value: "Countryside, IL", href: null },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Talk to an <span className="gradient-text">ELD specialist.</span>
          </>
        }
        sub="Questions about pricing, hardware or monitoring? We'll help you find the right fit and get your fleet compliant fast."
      />

      <section className="bg-slate-50 py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          {/* details */}
          <div>
            <h2 className="text-2xl font-bold text-ink-800">Get in touch</h2>
            <p className="mt-2 text-slate-600">
              Reach the team directly, or send the form and we'll come to you.
            </p>

            <div className="mt-8 space-y-4">
              {DETAILS.map((d) => {
                const inner = (
                  <>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <d.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{d.label}</p>
                      <p className="font-semibold text-ink-800">{d.value}</p>
                    </div>
                  </>
                );
                return d.href ? (
                  <a
                    key={d.label}
                    href={d.href}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-soft"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={d.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-2.5 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-cyanx-500" /> 24/7 support for drivers & dispatch
              </p>
              <p className="flex items-center gap-2.5 text-sm text-slate-600">
                <ShieldCheck className="h-4 w-4 text-cyanx-500" /> Free 14-day trial — no contract
              </p>
            </div>
          </div>

          {/* form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
