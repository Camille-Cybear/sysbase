import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode — palette sysbase.fr
        bg: "#0F0F13",
        card: "#1A1A24",
        sidebar: "#13131A",
        border: "#2A2A3A",
        text: "#F0F0F5",
        muted: "#8888AA",
        primary: {
          DEFAULT: "#7B6FD4",
          mid: "#AFA9EC",
        },
        // Couleurs d'accent par module (calibrées pour fond sombre)
        module: {
          reseaux: "#7B6FD4",
          ad: "#2EB88A",
          linux: "#E0703F",
          securite: "#D69A34",
          virtualisation: "#2EB88A",
          scripting: "#7B6FD4",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
