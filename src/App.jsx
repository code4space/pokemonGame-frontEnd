import './App.css'
import './assets/css/home.css'
import './assets/css/login.css'
import './assets/css/collection.css'
import './assets/css/draw.css'
import './assets/css/cardDetail.css'
import {RouterProvider} from "react-router-dom"
import store from './store/store'
import { Provider } from 'react-redux'
import router from './router/router'

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  )
}

export default App
