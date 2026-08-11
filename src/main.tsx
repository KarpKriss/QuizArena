import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './brand-overrides.css'
import './logo-fix.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
