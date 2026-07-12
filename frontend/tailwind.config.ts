import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0E9F92",
          strong: "#007F76",
          gold: "#D89B28",
          success: "#00A699",
          error: "#E61E4D",
          ink: "#17211F",
          muted: "#69736F",
          line: "#E1E8E3",
          soft: "#F4FAF7",
          ivory: "#FFFDF8",
          pearl: "#FAF8F2",
          frost: "#FFFFFFF2"
        }
      },
      boxShadow: {
        luxe: "0 28px 80px rgba(18, 41, 36, 0.12), 0 2px 10px rgba(18, 41, 36, 0.05)",
        lift: "0 14px 38px rgba(18, 41, 36, 0.10), 0 1px 0 rgba(255, 255, 255, 0.82) inset",
        pearl: "0 22px 60px rgba(18, 41, 36, 0.08), 0 1px 0 rgba(255, 255, 255, 0.94) inset"
      },
      borderRadius: {
        luxe: "18px"
      }
    }
  },
  plugins: []
};

export default config;
