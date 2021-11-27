module.exports = {
  mode: "jit",
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        rtd_green: {
          light: "#232F3E",
          dark: "#6ba61c",
          DEFAULT: "#5B9D03",
        },
      },
      backgroundImage: {
        "hero-pattern": "url('/img/hero-2xl.png')",
        "hero-pattern-sm": "url('/img/hero-sm.png')",
        "hero-pattern-md": "url('/img/hero-md.png')",
        "hero-pattern-lg": "url('/img/hero-lg.png')",
        "hero-pattern-xl": "url('/img/hero-xl.png')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
