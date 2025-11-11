import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  // ✅ FIX #1: Correct dark mode declaration
  darkMode: ["class", ".dark"],

  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      screens: { "2xl": "1400px" },
    },

    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        success: "var(--status-success)",
        error: "var(--status-error)",
        warning: "var(--status-warning)",
        info: "var(--status-info)",
        tertiary: "var(--tertiary)",
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },

      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "ui-monospace", "monospace"],
        tile: ["SF Pro Display", "Inter", "system-ui", "sans-serif"],
      },

      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },

      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-accent": "var(--gradient-accent)",
        "gradient-tertiary": "var(--gradient-tertiary)",
      },

      keyframes: {
        "aurora-gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "aurora-glow": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        "cosmic-wave": {
          "0%, 100%": { transform: "translateX(0)" },
          "33%": { transform: "translateX(25px)" },
          "66%": { transform: "translateX(-20px)" },
        },
      },

      animation: {
        "aurora-gradient": "aurora-gradient 25s ease infinite",
        "aurora-glow": "aurora-glow 16s ease-in-out infinite",
        "cosmic-wave": "cosmic-wave 28s ease-in-out infinite",
      },
    },
  },

  // ✅ FIX #2: Add proper typing for plugin function
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    plugin(({ addVariant }: { addVariant: (name: string, selector: string) => void }) => {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    }),
  ],
};

export default config;
