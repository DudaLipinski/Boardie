import './App.css'
import 'antd/dist/antd.min.css'
import AppRoutes from './routes/AppRoutes'
import state from './state'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

const MobileWrapper = styled.div`
  max-width: 479px;
  margin-left: auto;
  display: block;
  margin-right: auto;
`

function App() {
  return (
    <MobileWrapper>
      <Provider store={state}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </MobileWrapper>
  )
}

export default App
