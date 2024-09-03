/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './app/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
      extend: {
        colors: {
          "primary": "#00c292",
          "primary-50": "#85e2cb",
          "primary-75": "#40d1ad",
          "primary-25": "#bff0e4",
          "primary-20": "#ccf3e9",
          "primary-10": "#e5f9f4",
          "l-grey" : "#d4d4d4",
        },
        fontSize: {
          'hero': '68px',
          'heading': '44px',
          'subheading': '36px',
          "cardtitle": "40px",
          "heading": "24px",
          'text': '20px',
          "btn_title": "18px",
          "medium": "16px",
          "small": "14px"
        },
        fontFamily: {
          'Display': ['"Oxygen Mono"', 'serif']
        },
      },
  },
  plugins: [],
};