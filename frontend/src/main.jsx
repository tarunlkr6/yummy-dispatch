import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "@material-tailwind/react";
import { materialTheme } from './configs/theme.js';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import store, { persistor } from './store.js';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PayPalScriptProvider deferLoading={true}>
          <BrowserRouter>
            <ThemeProvider value={materialTheme}>
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </PayPalScriptProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);