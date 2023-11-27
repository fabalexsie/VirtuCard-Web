/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './src/**/*.{html,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /[m/p].*-[0-9]+/, // for margin and padding availability in ejs template
    },
  ],
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            focus: '#5390d9',
            primary: {
              50: '#e1f3ff',
              100: '#bcd7f6',
              200: '#95bceb',
              300: '#6ba1e0',
              400: '#4386d5',
              500: '#2a6cbc',
              600: '#1d5493',
              700: '#123c6a',
              800: '#062443',
              900: '#000d1c',
            },
            secondary: {
              50: '#FBD6FC',
              100: '#F5C9FB',
              200: '#E594F7',
              300: '#C75DE9',
              400: '#A335D4',
              500: '#7400B8',
              600: '#5A009E',
              700: '#430084',
              800: '#2F006A',
              900: '#220058',
            },
            success: {
              50: '#F7FDDA',
              100: '#F2FCCE',
              200: '#E3F99E',
              300: '#CAED6B',
              400: '#AEDB45',
              500: '#88C411',
              600: '#6EA80C',
              700: '#578D08',
              800: '#427105',
              900: '#335E03',
            },
            warning: {
              50: '#FEFAD9',
              100: '#FEF8CD',
              200: '#FEEF9B',
              300: '#FEE469',
              400: '#FDD944',
              500: '#FCC707',
              600: '#D8A605',
              700: '#B58603',
              800: '#926902',
              900: '#785401',
            },
            danger: {
              50: '#FDEFDB',
              100: '#FCE8CE',
              200: '#FACC9F',
              300: '#F1A56E',
              400: '#E37F49',
              500: '#D14A14',
              600: '#B3320E',
              700: '#961F0A',
              800: '#790F06',
              900: '#640503',
            },
          },
        },
      },
    }),
  ],
};
