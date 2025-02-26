import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      scale: {
        "120": "1.2",
      },
      keyframes: {
        scaleUp: {
          "0%": {
            transform: "scaleY(0)",
            opacity: "0",
            transformOrigin: "bottom",
          },
          "100%": {
            transform: "scaleY(1)",
            opacity: "1",
            transformOrigin: "bottom",
          },
        },
        scaleDown: {
          "0%": {
            transform: "scaleY(1)",
            opacity: "1",
            transformOrigin: "bottom",
          },
          "100%": {
            transform: "scaleY(0)",
            opacity: "0",
            transformOrigin: "bottom",
          },
        },
      },
      animation: {
        scaleUp: "scaleUp 0.6s ease-in-out",
        scaleDown: "scaleDown 0.6s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
