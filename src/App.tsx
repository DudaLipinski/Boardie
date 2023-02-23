import './App.css'
import 'antd/dist/antd.min.css'
import AppRoutes from './routes/AppRoutes'
import state from './state'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'
import { ThemeProvider } from '@mui/material'
import { theme } from './styles/theme'

const MobileWrapper = styled.div`
  max-width: 479px;
  height: 100vh;
  background-color: var(--adm-color-background);
  margin: 0 auto;
  display: block;
`

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MobileWrapper>
        <Provider store={state}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </Provider>
      </MobileWrapper>
    </ThemeProvider>
  )
}

export default App
