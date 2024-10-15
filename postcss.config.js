/**
 * @file postcss.config.js
 * @description PostCSS configuration.
 */

module.exports = {
  plugins: [require("tailwindcss"), require("autoprefixer"), require("cssnano")({ preset: "default" })],
};
