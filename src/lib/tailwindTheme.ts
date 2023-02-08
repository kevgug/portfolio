export const tailwindTheme = {
    colors: {
      background: "#141518",
      white: "#FFFFFF",
      'glacial-blue': "#A9F4E9",
      'muted-text-grey': '#8B8B8B',
      'description-text-grey': '#E2E2E2',
      'bullet-grey': '#4F4F4F',
      'separator-grey': "#2D2D2D",
    },
    fontFamily: {
      sans: ['Euclid Square'],
      serif: ['SangBleu Sunrise'],
    },
    fontSize: {
      xs: '0.7rem', // 
      sm: '0.9rem', // 13.6px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.438rem', // 23px
      '2xl': '1.75rem', // 28px
      '3xl': '2.25rem', // 36px
      '4xl': '3rem', // 48px
      '5xl': '4rem', // 64px
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      borderRadius: {
        'lg': '0.7rem', // 11.2px
        '4xl': '1.75em', // 28px
        '5xl': '1.875em', // 30px
        '6xl': '2.25em', // 36px
      },
      padding: {
        'screen-y': '2.25rem', // 36px
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
  } as const