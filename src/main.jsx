import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  // Wrap the entire app in BrowserRouter to enable routing (to navigate between pages)
      <App />
    </BrowserRouter>
    <App />
  </StrictMode>,
)
