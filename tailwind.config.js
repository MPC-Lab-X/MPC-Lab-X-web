/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.ejs", "./public/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
        background: "#F2F2F2",
        primary: "#1F67A6",
        secondary: "#1B91BF",
        accent: "#0F9FBF",
        dark: {
          300: "#151926",
          DEFAULT: "#10121E",
          700: "#0C0E1A",
        },
        text: {
          DEFAULT: "#0C0E1A",
          light: "#F2F2F2",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
