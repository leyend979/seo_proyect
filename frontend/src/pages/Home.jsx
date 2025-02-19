// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Aplicación de Estudio</h1>
      <p>Bienvenido a la aplicación de estudio. Elige una opción:</p>
      <ul>
        <li><Link to="/temas">Ver Temas</Link></li>
        <li><Link to="/flashcards">Ver Flashcards</Link></li>
      </ul>
    </div>
  );
};

export default Home;
