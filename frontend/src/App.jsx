// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Temas from './pages/Temas';
import TemaDetail from './pages/TemaDetail';
import SubtemaDetail from './pages/SubtemaDetail'; // Nuevo componente
import Flashcards from './pages/Flashcards';

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/">Inicio</Link> |{' '}
        <Link to="/temas">Temas</Link> |{' '}
        <Link to="/flashcards">Flashcards</Link>
        
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/temas" element={<Temas />} />
        <Route path="/temas/:id" element={<TemaDetail />} />
        <Route path="/temas/:id/subtemas/:subIndex" element={<SubtemaDetail />} />
        <Route path="/flashcards" element={<Flashcards />} />
      </Routes>
    </div>
  );
}

export default App;


