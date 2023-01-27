/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'], // paths to all template files
  theme: {
    colors: {
      background: "#141518",
      white: "#FFFFFF",
      'muted-text-grey': '#4F4F4F',
      'glacial-blue': "#A9F4E9",
      'separator-grey': "#494949"
    },
    fontFamily: {
      sans: ['Euclid Square'],
      serif: ['SangBleu Sunrise'],
    },
    fontSize: {
      sm: '0.85rem', // 13.6px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.438rem', // 23px
      '2xl': '1.75rem', // 28px
      '3xl': '2.25rem', // 36px
      '4xl': '3rem', // 48px
    },
    extend: {
      borderRadius: {
        'lg': '0.7rem', // 11.2px
      },
      padding: {
        'separator-y': '1.75rem' // 28px
      },
      transitionTimingFunction: {
        intro: 'cubic-bezier(0, 0.98, 0.31, 0.98)',
        outro: 'cubic-bezier(0.23,0.49,0.31,0.98)'
      },
      transitionDuration: {
        intro: '390ms',
        outro: '80ms'
      }
    }
  },
  plugins: [],
}
