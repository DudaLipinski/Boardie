import AppRoutes from './routes/AppRoutes'
import state from './state'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { theme } from './styles/theme'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

dayjs.extend(utc)

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={state}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AppRoutes />
              <ReactQueryDevtools />
            </BrowserRouter>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
