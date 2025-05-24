import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import ThreeColumnLayout from './components/ThreeColumnLayout'; // 👈 Importa aquí

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/">Inicio</Link> |{' '}
        <Link to="/flashcards">Flashcards</Link> |{' '}
        <Link to="/explorar">Explorar</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/explorar" element={<ThreeColumnLayout />} /> {/* 👈 Aquí se integra */}
      </Routes>
    </div>
  );
}

export default App;

