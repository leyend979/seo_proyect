import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CollectionModal from './CollectionModal';

const ThreeColumnLayout = () => {
  const [temas, setTemas] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [subtemaSeleccionado, setSubtemaSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [coleccionEditar, setColeccionEditar] = useState(null);

  // Cargar todos los temas al iniciar
  useEffect(() => {
    axios.get('https://super-duper-goggles-r4v7w7wrggfx95v-5173.app.github.dev/api/temas')
      .then(res => setTemas(res.data))
      .catch(err => console.error('Error al cargar temas:', err));
  }, []);

  const seleccionarTema = (tema) => {
    setTemaSeleccionado(tema);
    setSubtemaSeleccionado(null);
  };

  const seleccionarSubtema = (subtema) => {
    setSubtemaSeleccionado(subtema);
  };

  const abrirModal = (coleccion = null) => {
    setColeccionEditar(coleccion);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setColeccionEditar(null);
  };

  const actualizarColeccion = (nuevaColeccion) => {
    const nuevosTemas = [...temas];
    const temaIdx = nuevosTemas.findIndex(t => t._id === temaSeleccionado._id);
    const subtemaIdx = nuevosTemas[temaIdx].subtemas.findIndex(s => s._id === subtemaSeleccionado._id);

    if (coleccionEditar) {
      // Editar colección existente
      const colecciones = nuevosTemas[temaIdx].subtemas[subtemaIdx].colecciones;
      const idx = colecciones.findIndex(c => c._id === coleccionEditar._id);
      colecciones[idx] = { ...coleccionEditar, ...nuevaColeccion };
    } else {
      // Nueva colección
      nuevosTemas[temaIdx].subtemas[subtemaIdx].colecciones.push(nuevaColeccion);
    }

    setTemas(nuevosTemas);
    cerrarModal();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Columna 1: Temas */}
      <div style={{ width: '20%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h4 style={{ padding: '1rem' }}>Temas</h4>
        {temas.map(tema => (
          <div key={tema._id}
            onClick={() => seleccionarTema(tema)}
            style={{
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              backgroundColor: temaSeleccionado?._id === tema._id ? '#eee' : 'transparent'
            }}>
            {tema.nombre}
          </div>
        ))}
      </div>

      {/* Columna 2: Subtemas */}
      <div style={{ width: '20%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h4 style={{ padding: '1rem' }}>Subtemas</h4>
        {temaSeleccionado?.subtemas.map(subtema => (
          <div key={subtema._id}
            onClick={() => seleccionarSubtema(subtema)}
            style={{
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              backgroundColor: subtemaSeleccionado?._id === subtema._id ? '#eee' : 'transparent'
            }}>
            {subtema.nombre}
          </div>
        ))}
      </div>

      {/* Columna 3: Colecciones */}
      <div style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>Colecciones</h4>
          {subtemaSeleccionado && (
            <button onClick={() => abrirModal()}>+ Nueva colección</button>
          )}
        </div>

        {subtemaSeleccionado?.colecciones?.map(coleccion => (
          <div key={coleccion._id} style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h5>{coleccion.nombre}</h5>
            <div dangerouslySetInnerHTML={{ __html: coleccion.contenido }} />
            <button onClick={() => abrirModal(coleccion)} style={{ marginTop: '0.5rem' }}>Editar</button>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <CollectionModal
          initialData={coleccionEditar}
          onSubmit={actualizarColeccion}
          onClose={cerrarModal}
        />
      )}
    </div>
  );
};

export default ThreeColumnLayout;
