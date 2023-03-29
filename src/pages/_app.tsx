import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@/styles/index.css'

import { ThemeProvider } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { theme } from '@/styles/theme'
import { AuthProvider } from '@/core/AuthContext'
import { Mobile } from '@/components/Mobile'
import { useState } from 'react'

dayjs.extend(utc)

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <AuthProvider>
              <Mobile>
                <Component {...pageProps} />
              </Mobile>
              <ReactQueryDevtools />
            </AuthProvider>
          </Hydrate>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
