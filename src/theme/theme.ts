'use client';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { Heebo } from 'next/font/google';

const heebo = Heebo({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

let theme = createTheme({
  palette: {
    primary: {
      main: '#253D90',
    },
    secondary: {
      main: '#E0C2FF',
      light: '#EDF7FA',
      contrastText: '#253D90',
    },
    text: {
      primary: '#21243D'
    },
  },
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class', 
  },
  typography: {
    fontFamily: heebo.style.fontFamily,
  },
  components: {
    MuiContainer:{
      defaultProps: {
        maxWidth: 'md',
      },
      styleOverrides: {
        maxWidthSm: {
          maxWidth: '739px',
          '@media (min-width: 600px)': {
              maxWidth: '739px'
            },
        },
        maxWidthMd: {
          maxWidth: '1600px',
          '@media (min-width: 900px)': {
            maxWidth: '1600px'
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#60a5fa',
              },
            },
          ],
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none'
      },
      styleOverrides: {
          root: {
            color: '#253D90',
            '&:hover, &.active':{
              color:'#043af5'
            }
          }
      }
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained', color: 'primary'},
          style: {
            color: '#fff'
          },
        },
      ]
    },
    MuiChip: {
      styleOverrides: {
        root: {
          paddingInline: 2
        },
      },
      variants: [{
        props: {color: 'secondary'},
        style: {
          color: '#fff',
          fontSize: 16,
          backgroundColor: '#142850',
        },
      }]
    },
  },
});

theme = responsiveFontSizes(theme);
// theme.typography.h3 = {
//   fontSize: '2rem',

//   [theme.breakpoints.up('md')]: {
//     fontSize: '3rem',
//   }
// }
export default theme;
