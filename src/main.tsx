import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Scoreboard from './Scoreboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Scoreboard nSets={5} timeBySet={60}/>
  </StrictMode>,
)
