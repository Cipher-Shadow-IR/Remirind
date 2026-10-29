/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"EB Garamond"', '"Professional Garamond"', 'Georgia', 'serif'],
        display: ['"EB Garamond"', '"Professional Garamond"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', '"Professional Instrument"', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'],
      },
      colors: {
        // Authoritative Professional Design System Tokens
        ground: '#f7f4ec',
        surface: '#fcfaf5',
        ink: '#29271f',
        'ink-muted': '#514d44',
        accent: {
          DEFAULT: '#8b713a',
          ink: '#68501f',
          foreground: '#f7f4ec',
        },
        line: '#d4ccbd',
        'band-edge': '#e7e0d3',
        'action-hover': '#454034',

        // Theme Mapping
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        DEFAULT: '3px',
        sm: '2px',
        md: '3px',
        lg: '4px',
        xl: '4px',
        '2xl': '6px',
        full: '9999px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms linear',
      },
    },
  },
  plugins: [],
};
