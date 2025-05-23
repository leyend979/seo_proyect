import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TituloForm from '../components/TituloForm';

const Titulos = () => {
  const [titulos, setTitulos] = useState([]);
  const [tituloSeleccionado, setTituloSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const fetchTitulos = async () => {
    try {
      const res = await axios.get('https://super-duper-goggles-r4v7w7wrggfx95v-5173.app.github.dev/api/titulos');
      setTitulos(res.data);
    } catch (error) {
      console.error('Error al obtener títulos:', error);
    }
  };

  useEffect(() => {
    fetchTitulos();
  }, []);

  const handleEditarTitulo = (titulo) => {
    setTituloSeleccionado(titulo);
    setMostrarFormulario(true);
  };

  const handleNuevoTitulo = () => {
    setTituloSeleccionado(null);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setTituloSeleccionado(null);
    setMostrarFormulario(false);
  };

  const handleGuardarTitulo = async (tituloData) => {
    try {
      if (tituloSeleccionado) {
        await axios.put(`https://super-duper-goggles-r4v7w7wrggfx95v-5173.app.github.dev/api/titulos/${tituloSeleccionado._id}`, tituloData);
      } else {
        await axios.post('https://super-duper-goggles-r4v7w7wrggfx95v-5173.app.github.dev/api/titulos', tituloData);
      }
      fetchTitulos();
      handleCerrarFormulario();
    } catch (error) {
      console.error('Error al guardar título:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      <h2>Listado de Títulos</h2>
      {titulos.length === 0 ? (
        <p>No hay títulos registrados.</p>
      ) : (
        <div className="titulos-list">
          {titulos.map((titulo) => (
            <div key={titulo._id} className="titulo-card" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{titulo.nombre}</h3>
              <p>{titulo.descripcion}</p>
              <button onClick={() => handleEditarTitulo(titulo)}>Editar</button>
              <Link to={`/titulos/${titulo._id}`}>
                <button>Ver Detalles</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={handleNuevoTitulo} 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          fontSize: '24px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        +
      </button>

      {mostrarFormulario && (
        <TituloForm 
          titulo={tituloSeleccionado} 
          onSubmit={handleGuardarTitulo} 
          onClose={handleCerrarFormulario} 
        />
      )}
    </div>
  );
};

export default Titulos;
