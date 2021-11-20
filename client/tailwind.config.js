module.exports = {
  //configure the purge option with the paths to all of your components
  //so Tailwind can tree-shake unused styles in production builds:
  purge: [
    "./**/*.{js, jsx,ts,tsx,css}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
