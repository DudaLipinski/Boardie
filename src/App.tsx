import './App.css'
import 'antd/dist/antd.min.css'
import AppRoutes from './AppRoutes'
import state from './state'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <div>
      <Provider store={state}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
