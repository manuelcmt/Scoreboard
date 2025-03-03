import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import Scoreboard from './Scoreboard.tsx'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ display: 'block', width: '100%', aspectRatio: '2/1', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', top: 0, left: 0 }}>
      <App />
    </div>
  </StrictMode>,
)
