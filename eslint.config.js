import astro from "eslint-plugin-astro";

export default [
  ...astro.configs["flat/recommended"],
  {
    ignores: [
      "dist/",
      "node_modules/",
      ".astro/",
      "assets/**",
      "_includes/**",
      "_layouts/**",
      "gulpfile.js"
    ]
  },
  {
    rules: {
      "astro/no-set-html-directive": "off"
    }
  }
];
