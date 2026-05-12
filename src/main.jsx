import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <HashRouter>
        <AuthProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </AuthProvider>
      </HashRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
