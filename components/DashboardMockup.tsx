import { Activity, MapPin, Truck, ShieldCheck, Clock } from "lucide-react";

/**
 * A self-contained "product screenshot" of the AI ELD fleet dashboard,
 * built with markup + SVG so the site ships with zero external image deps.
 */
export default function DashboardMockup() {
  return (
    <div className="relative w-full rounded-[26px] border border-white/10 bg-ink-800/80 p-3 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.65)] backdrop-blur">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-3 pb-3 pt-1">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <div className="ml-3 flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-[11px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> app.ai-eld.com/fleet
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl bg-ink-900 p-3 sm:grid-cols-[1.5fr_1fr]">
        {/* map panel */}
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-ink-700 to-ink-900 p-4">
          <div className="absolute inset-0 bg-grid-dark [background-size:26px_26px] opacity-40" />
          {/* route line */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 220" fill="none" preserveAspectRatio="none">
            <path
              d="M20 180 C 80 120, 120 160, 170 90 S 280 60, 300 30"
              stroke="url(#rg)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4 8"
            />
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="320" y2="0">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#3b6bff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live fleet map</span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-emerald-400" /> 42 active
            </span>
          </div>
          {/* truck pins */}
          <div className="relative mt-10 h-28">
            {[
              { l: "16%", t: "8%", c: "text-cyanx-400" },
              { l: "52%", t: "44%", c: "text-brand-400" },
              { l: "78%", t: "14%", c: "text-emerald-400" },
              { l: "34%", t: "66%", c: "text-amber-300" },
            ].map((p, i) => (
              <div key={i} className="absolute" style={{ left: p.l, top: p.t }}>
                <span className={`relative flex ${p.c}`}>
                  <MapPin className="h-5 w-5 fill-current/20" />
                </span>
              </div>
            ))}
            <div className="absolute bottom-0 left-0 flex items-center gap-2 rounded-lg border border-white/10 bg-ink-800/90 px-2.5 py-1.5">
              <Truck className="h-4 w-4 text-cyanx-400" />
              <div>
                <p className="text-[11px] font-semibold text-white">Unit 1147 · I-80 W</p>
                <p className="text-[10px] text-slate-400">HOS: 6h 12m driving left</p>
              </div>
            </div>
          </div>
        </div>

        {/* stats column */}
        <div className="space-y-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3.5">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">FMCSA safety score</span>
            </div>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-white">96%</span>
              <span className="mb-1 text-[11px] font-semibold text-emerald-400">▲ 4.2</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-brand-500 to-cyanx-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <Clock className="h-4 w-4 text-brand-400" />
              <p className="mt-2 text-xl font-extrabold text-white">0</p>
              <p className="text-[10px] text-slate-400">HOS violations</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <Activity className="h-4 w-4 text-cyanx-400" />
              <p className="mt-2 text-xl font-extrabold text-white">3</p>
              <p className="text-[10px] text-slate-400">Diagnostics flagged</p>
            </div>
          </div>

          {/* log timeline */}
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Daily log · Driver 14</p>
            <div className="mt-3 space-y-2">
              {[
                { label: "Driving", w: "72%", c: "from-brand-500 to-brand-400" },
                { label: "On duty", w: "44%", c: "from-cyanx-500 to-cyanx-400" },
                { label: "Off duty", w: "30%", c: "from-emerald-500 to-emerald-400" },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-2">
                  <span className="w-14 text-[10px] text-slate-400">{r.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full bg-gradient-to-r ${r.c}`} style={{ width: r.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
