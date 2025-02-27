// src/pages/Temas.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Temas = () => {
  const [temas, setTemas] = useState([]);

  // Función para obtener los temas del backend
  const fetchTemas = async () => {
    try {
      const res = await axios.get('https://rkhqsv30-5173.uks1.devtunnels.ms/api/temas');
      setTemas(res.data);
    } catch (error) {
      console.error('Error al obtener temas:', error);
    }
  };

  useEffect(() => {
    fetchTemas();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Listado de Temas</h2>
      {temas.length === 0 ? (
        <p>No hay temas registrados.</p>
      ) : (
        <div className="temas-list">
          {temas.map((tema) => (
            <div key={tema._id} className="tema-card" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{tema.nombre}</h3>
              <p>{tema.descripcion}</p>
              {/* Al hacer clic en este botón, se redirige a la vista de detalle del tema */}
              <Link to={`/temas/${tema._id}`}>
                <button>Ver Detalles</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Temas;


