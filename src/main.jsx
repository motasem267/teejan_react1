import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Login from './App.jsx'
import Result from './Result.jsx'
import Curricula from './Curricula.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/result" element={<Result />} />
        <Route path="/curricula" element={<Curricula />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
