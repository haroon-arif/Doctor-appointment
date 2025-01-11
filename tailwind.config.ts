import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        'laptop': '56px',
      },
      maxWidth: {
        'laptop': '1440px',
      },
      backgroundImage: {
        "background-gradiant":
          "linear-gradient(87deg, #FEE7E7 0%, #E7EFF7 49.5%, #E4DEFF 100%)",
      },
      colors: {
        "background-primary": "#F3F6FF",
        "background-white":"#FFFFFF",
        "background-secondary": "#E4E4F8",
        "background-lite": "#F2F5FF",
        "background-2324": "#F9FAFF",
        "text-light": "#8494b6",
        "background-disable": "#ffffff80",
        "text-muted": "#626F93",
        "text-dark": "#313D5B",
        accent: "#6968EC",
        error: "#F88080",
        stroke: "#DADAFC",
        100: "#F1F2F3",
        300: "#AEB2BF",
        400: "#8F95A9",
        500: "#71788E",
        600: "#585C6A",
        700: "#3E4147",
        800: "#444753",
        900: "#282828",
      },
      fontWeight: {
        hairline: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [],
};
export default config;
