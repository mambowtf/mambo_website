import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: { boxShadow: { ring: "0 12px 32px rgba(16,185,129,.35)" } },
  },
  plugins: [],
};
export default config;
