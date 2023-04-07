import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface PaletteColor {
    darker?: string
  }

  interface SimplePaletteColorOptions {
    darker?: string
  }

  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color']
    }
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: `'Inter', sans-serif`,
    h1: {
      fontSize: '24pt',
    },
    h2: {
      fontSize: '18pt',
    },
    h3: {
      fontSize: '15.25pt',
    },
    h4: {
      fontSize: '13.5pt',
    },
    h5: {
      fontSize: '12.75pt',
    },
    h6: {
      fontSize: '12pt',
    },
    subtitle1: {
      fontSize: '12pt',
    },
    body1: {
      fontSize: '11pt',
    },
    caption: {
      fontSize: '11pt',
    },
    button: {
      textTransform: 'none',
    },
  },
  status: {
    danger: '#e53e3e',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF79C6',
    },
    secondary: {
      main: '#BD93F9',
    },
    info: {
      main: '#8BE9FD',
    },
    success: {
      main: '#50FA7B',
    },
    warning: {
      main: '#F1FA8C',
    },
    error: {
      main: '#FF5555',
    },
    background: {
      default: '#282A36',
      paper: '#414558',
    },
  },
  shape: {
    borderRadius: 8,
  },
})

// "primary": "#FF79C6",
// "secondary": "#BD93F9",
// "accent": "#FFB86C",
// "neutral": "#414558",
// "base-100": "#282A36",
// "info": "#8BE9FD",
// "success": "#50FA7B",
// "warning": "#F1FA8C",
// "error": "#FF5555",
