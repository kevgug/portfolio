/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'], // paths to all template files
  theme: {
    colors: {
      background: "#141518",
      white: "#FFFFFF",
      lightGrey: "#8B8B8B",
      mutedGrey: '#4f4f4f',
      glacialBlue: "#A9F4E9",
    },
    fontFamily: {
      sans: ['Euclid Square'],
      serif: ['SangBleu Sunrise'],
    },
    fontSize: {
      sm: '0.85rem', // 13px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.438rem', // 23px
      '2xl': '1.75rem', // 28px
      '3xl': '2.25rem', // 36px
      '4xl': '3.625rem', // 58px
    },
    extend: {
      borderRadius: {
        'lg': '0.7rem',
      },
      padding: {
        separatorY: '2.5rem'
      }
    }
  },
  plugins: [],
}
