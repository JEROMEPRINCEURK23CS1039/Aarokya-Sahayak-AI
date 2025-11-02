import React from 'react'
import { createRoot } from 'react-dom/client'

function App(){
  return <div style={{fontFamily:'Arial',padding:20}}>
    <h1>React + Node + MongoDB</h1>
    <p>API health: <span id="health">unknown</span></p>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
