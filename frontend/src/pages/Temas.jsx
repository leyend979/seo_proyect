import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TemaForm from '../components/TemaForm';

const Temas = () => {
  const [temas, setTemas] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

  const handleEditarTema = (tema) => {
    setTemaSeleccionado(tema);
    setMostrarFormulario(true);
  };

  const handleNuevoTema = () => {
    setTemaSeleccionado(null);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setTemaSeleccionado(null);
    setMostrarFormulario(false);
  };

  const handleGuardarTema = async (temaData) => {
    try {
      if (temaSeleccionado) {
        // Actualizar un tema existente
        await axios.put(`https://rkhqsv30-5173.uks1.devtunnels.ms/api/temas/${temaSeleccionado._id}`, temaData);
      } else {
        // Crear un nuevo tema
        await axios.post('https://rkhqsv30-5173.uks1.devtunnels.ms/api/temas', temaData);
      }
      fetchTemas(); // Refrescar la lista
      handleCerrarFormulario();
    } catch (error) {
      console.error('Error al guardar tema:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      <h2>Listado de Temas</h2>
      {temas.length === 0 ? (
        <p>No hay temas registrados.</p>
      ) : (
        <div className="temas-list">
          {temas.map((tema) => (
            <div key={tema._id} className="tema-card" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{tema.nombre}</h3>
              <p>{tema.descripcion}</p>
              <button onClick={() => handleEditarTema(tema)}>Editar</button>
              <Link to={`/temas/${tema._id}`}>
                <button>Ver Detalles</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Botón "+" para agregar un nuevo tema */}
      <button 
        onClick={handleNuevoTema} 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#28a745',
          color: 'white',
          fontSize: '24px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        +
      </button>

      {mostrarFormulario && (
        <TemaForm 
          tema={temaSeleccionado} 
          onSubmit={handleGuardarTema} 
          onClose={handleCerrarFormulario} 
        />
      )}
    </div>
  );
};

export default Temas;




