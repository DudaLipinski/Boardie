import './App.css'
import 'antd/dist/antd.min.css'
import AppRoutes from './routes/AppRoutes'
import state from './state'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

const MobileWrapper = styled.div`
  max-width: 479px;
  margin: 0 auto;
  display: block;
  margin-right: auto;
`

const BackgroundWrapper = styled.div`
  width: 100%;
  height: 100vh;
  margin: auto;
  background-color: #1c1b1e;
`

function App() {
  return (
    <MobileWrapper>
      <BackgroundWrapper>
        <Provider store={state}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </Provider>
      </BackgroundWrapper>
    </MobileWrapper>
  )
}

export default App
