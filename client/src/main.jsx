import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SocketContextProvider } from './socket/Socket.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </BrowserRouter>
)
