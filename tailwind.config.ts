import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070F",
          900: "#070B16",
          800: "#0B1426",
          700: "#111C33",
          600: "#1B2A47",
        },
        brand: {
          50: "#eff5ff",
          100: "#dbe7ff",
          200: "#bdd3ff",
          300: "#90b4ff",
          400: "#5b8bff",
          500: "#3b6bff",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        cyanx: {
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#22d3ee",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,107,255,0.25), 0 20px 60px -15px rgba(37,99,235,0.45)",
        card: "0 10px 40px -12px rgba(8,15,35,0.18)",
        soft: "0 2px 20px -8px rgba(8,15,35,0.15)",
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        "grid-light":
          "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 3s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        riseIn: "riseIn 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
}

export default config
