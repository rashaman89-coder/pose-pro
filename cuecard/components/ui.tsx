import Link from "next/link";
import type { ComponentProps } from "react";

/** App-chrome primitives. Quiet by design — the photographs are the star. */

type ButtonVariant = "primary" | "ink" | "outline" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink hover:opacity-90 border border-transparent",
  ink: "bg-ink text-paper hover:opacity-88 border border-transparent",
  outline: "border border-border bg-paper-raised hover:bg-paper-sunk",
  ghost: "border border-transparent hover:bg-border/40",
  danger: "border border-danger/40 text-danger hover:bg-danger/10",
};

const sizes = {
  sm: "h-9 px-3.5 text-[0.82rem]",
  md: "h-11 px-5 text-[0.9rem]",
  lg: "h-13 px-7 text-[0.95rem]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none " +
  "whitespace-nowrap cursor-pointer";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
}) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-2xl border border-border bg-paper-raised ${className}`}
      {...props}
    />
  );
}

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return (
    <input
      className={`h-11 w-full rounded-xl border border-border bg-paper-raised px-3.5
                  text-[0.92rem] outline-none transition-colors
                  placeholder:text-ink-faint focus:border-accent ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={`w-full resize-none rounded-xl border border-border bg-paper-raised
                  px-3.5 py-3 text-[0.92rem] leading-relaxed outline-none
                  transition-colors placeholder:text-ink-faint focus:border-accent
                  ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return (
    <select
      className={`h-11 w-full rounded-xl border border-border bg-paper-raised px-3
                  text-[0.92rem] outline-none transition-colors
                  focus:border-accent ${className}`}
      {...props}
    />
  );
}

export function Label({ className = "", ...props }: ComponentProps<"label">) {
  return (
    <label
      className={`mb-1.5 block text-[0.78rem] font-medium text-ink-soft ${className}`}
      {...props}
    />
  );
}

/** Horizontal filter pill. `active` inverts it to ink-on-paper. */
export function Chip({
  active = false,
  className = "",
  ...props
}: ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border
                  px-3.5 py-1.5 text-[0.78rem] font-medium transition-colors
                  cursor-pointer
                  ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-border bg-paper-raised text-ink-soft hover:bg-paper-sunk"
                  } ${className}`}
      {...props}
    />
  );
}

export function ProBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5
                  text-[0.62rem] font-semibold tracking-[0.08em] text-gold uppercase
                  ${className}`}
    >
      Pro
    </span>
  );
}

export function Shell({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}
      {...props}
    />
  );
}

export function Empty({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      {hint && <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">{hint}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
