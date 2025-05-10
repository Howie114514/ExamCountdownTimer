import React from 'react'
import ReactDOM from 'react-dom/client'
import '../assets/main.css'
import { Days } from './components/days'
import App from './components/app'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
)
