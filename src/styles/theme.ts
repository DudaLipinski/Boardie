import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary']
  }
  interface Palette {
    gold: Palette['primary']
  }

  interface PaletteOptions {
    gold: PaletteOptions['primary']
  }

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
    primary: {
      main: '#794dfd',
      darker: '#280987',
    },
    secondary: {
      main: '#f8f8f8',
      darker: '#7c7c7c',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
    gold: {
      main: '#ffd700',
    },
  },
})
