/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        vercel: '#000000',
        cloudflare: '#f6821f',
        // Cloudflare-inspired color system
        background: {
          DEFAULT: '#F9F7F5',
          secondary: '#F2EFE9',
        },
        foreground: {
          DEFAULT: '#2C2C31',
          secondary: '#4D4D59',
          tertiary: '#686877',
        },
        accents: {
          1: '#F2EFE9',
          2: '#E9E5DD',
          3: '#C5C2BB',
          4: '#B7B4AD',
          5: '#75727B',
          6: '#595665',
          7: '#44404F',
          8: '#32303B',
        },
        success: {
          lighter: '#CCEDE5',
          light: '#73D1BC',
          DEFAULT: '#00A88A',
          dark: '#007D66',
        },
        error: {
          lighter: '#F7D4D6',
          light: '#FF6B6B',
          DEFAULT: '#E74C3C',
          dark: '#C0392B',
        },
        warning: {
          lighter: '#FFF3CD',
          light: '#FFD166',
          DEFAULT: '#F6821F',
          dark: '#D96801',
        },
        primary: {
          lighter: '#FFF3E0',
          light: '#FFBD4F',
          DEFAULT: '#F6821F',
          dark: '#DB6E00',
        },
        secondary: {
          lighter: '#E2E6F4',
          light: '#A0AACB',
          DEFAULT: '#6E7CA0',
          dark: '#505B7A',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'Menlo',
          'Monaco',
          'Lucida Console',
          'Liberation Mono',
          'DejaVu Sans Mono',
          'Bitstream Vera Sans Mono',
          'Courier New',
          'monospace',
        ],
      },
      boxShadow: {
        'small': '0 5px 10px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'large': '0 30px 60px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'cloudflare': '8px',
      },
    },
  },
  plugins: [],
}

