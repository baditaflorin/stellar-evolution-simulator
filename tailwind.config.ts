import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coal: "#0b0d10",
        ink: "#12161b",
        panel: "#171c22",
        line: "#303840",
        plasma: "#f7b267",
        corona: "#ffd166",
        cyan: "#6ee7f9",
        ember: "#f97363",
        violet: "#b9a7ff",
      },
      boxShadow: {
        instrument: "0 18px 50px rgba(0, 0, 0, 0.34)",
      },
    },
  },
  plugins: [],
} satisfies Config;
