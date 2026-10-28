import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { lytoos: { DEFAULT: "#7c3aed", dark: "#0b0b12" } } } },
  plugins: [],
};
export default config;
