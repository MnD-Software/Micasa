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
          DEFAULT: "#FF5A5F",
          strong: "#FF385C",
          gold: "#FFB400",
          success: "#00A699",
          error: "#E61E4D",
          ink: "#222222",
          muted: "#717171",
          line: "#E7E4DF",
          soft: "#F8F8F6",
          ivory: "#FFFDFC",
          pearl: "#FBFAF8",
          frost: "#FFFFFFF2"
        }
      },
      boxShadow: {
        luxe: "0 28px 80px rgba(34, 34, 34, 0.12), 0 2px 10px rgba(34, 34, 34, 0.05)",
        lift: "0 14px 38px rgba(34, 34, 34, 0.10), 0 1px 0 rgba(255, 255, 255, 0.80) inset",
        pearl: "0 22px 60px rgba(34, 34, 34, 0.08), 0 1px 0 rgba(255, 255, 255, 0.94) inset"
      },
      borderRadius: {
        luxe: "18px"
      }
    }
  },
  plugins: []
};

export default config;
