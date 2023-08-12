import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { theme } from './styles/theme'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './core/AuthContext'

import messages from './locales/en/messages.json'

i18n.load('en', messages)
i18n.activate('en')

dayjs.extend(utc)

const queryClient = new QueryClient()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <I18nProvider i18n={i18n}>
                <AppRoutes />
              </I18nProvider>
              <ReactQueryDevtools />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
