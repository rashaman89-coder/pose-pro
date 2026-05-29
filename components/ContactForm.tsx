"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 text-xl font-bold text-ink-800">Thanks — we'll be in touch.</h3>
        <p className="mt-2 text-slate-600">
          An ELD specialist will reach out shortly. Need help now? Call{" "}
          <a href="tel:+13074520669" className="font-semibold text-brand-600">
            (307) 452-0669
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-9"
    >
      <h2 className="text-2xl font-bold text-ink-800">Start your free trial</h2>
      <p className="mt-1.5 text-sm text-slate-500">
        Tell us about your fleet and we'll get you set up — usually the same day.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" placeholder="Jordan Rivera" required />
        <Field label="Company" name="company" placeholder="Rivera Logistics" />
        <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
        <Field label="Phone" name="phone" type="tel" placeholder="(555) 123-4567" />
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-ink-800">Number of trucks</label>
          <select
            name="trucks"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-ink-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
          >
            <option>1 (owner-operator)</option>
            <option>2–10</option>
            <option>11–50</option>
            <option>51–200</option>
            <option>200+</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-ink-800">How can we help?</label>
          <textarea
            name="message"
            rows={4}
            placeholder="Tell us about your equipment mix and monitoring needs…"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-ink-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary mt-7 w-full text-base">
        Request my free trial <Send className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">
        No contract. 14-day free trial. We never share your details.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink-800">
        {label} {required && <span className="text-brand-600">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-ink-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}
