import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { "defaul-dark": "#161b22" },
    },
  },
  plugins: [],
} satisfies Config;
