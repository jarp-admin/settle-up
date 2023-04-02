import daisyui from "daisyui";
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { "defaul-dark": "#161b22" },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#ffc517",
          secondary: "#FF6230",
          accent: "#38bdf8",
          neutral: "#0f172a",
          "base-100": "#020617",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
} satisfies Config;
