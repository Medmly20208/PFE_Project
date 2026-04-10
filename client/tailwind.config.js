/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        toTop: {
          "0%": { bottom: "-50px" },
          "100%": { bottom: "20px" },
        },
      },
      animation: {
        toTop: "toTop 200ms linear ",
      },
      colors: {
        "main-black": "#161C24",
        "secondary-black": "#212B36",
        "main-red": "#F23D5E",
        "primary-red": "#F26B83",
        "secondary-red": "#F299A9",
        "main-gray": "#D9D9D9",
      },
      fontFamily: {
        primary: "Kollektif",
      },

      dropShadow: {
        custom: "0 45px 45px rgba(240, 2, 2, 0.25)",
      },
    },
  },
  plugins: [],
};
