import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'chili-red': '#B22222',
        'mustard-gold': '#FFD447',
        'skyline-blue': '#1C3FAA',
        'onion-white': '#F5F5F5',
      },
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
