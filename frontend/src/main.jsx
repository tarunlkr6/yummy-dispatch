import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from "@material-tailwind/react"
import { materialTheme } from './configs/theme.js'
import { Provider } from 'react-redux'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import store from './store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading= {true}>
      <BrowserRouter>
        <ThemeProvider value={materialTheme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
)
