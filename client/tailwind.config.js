module.exports = {
  //configure the purge option with the paths to all of your components
  //so Tailwind can tree-shake unused styles in production builds:
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
