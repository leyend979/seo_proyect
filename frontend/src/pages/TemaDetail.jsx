import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TemaDetail = () => {
  const { id } = useParams();
  const [tema, setTema] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTema = async () => {
      try {
        const res = await axios.get(`https://ideal-potato-g4rjv7g56w4xhw7x9-5173.app.github.dev/api/temas/${id}`);
        setTema(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el tema:', error);
        setLoading(false);
      }
    };
    fetchTema();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!tema) return <p>No se encontró el tema.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/">← Volver a Temas</Link>
      <h2>{tema.nombre}</h2>
      <p>{tema.descripcion}</p>

      <h3>Subtemas:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tema.subtemas && tema.subtemas.length > 0 ? (
          tema.subtemas.map((subtema, index) => (
            <li key={index} style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              marginBottom: '0.5rem',
              borderRadius: '5px'
            }}>
              <Link to={`/temas/${id}/subtemas/${index}`} style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.2rem' }}>
                {subtema.nombre}
              </Link>
            </li>
          ))
        ) : (
          <p>No hay subtemas en este tema.</p>
        )}
      </ul>
    </div>
  );
};

export default TemaDetail;







