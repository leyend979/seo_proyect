import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CollectionModal from './CollectionModal';
import TemaForm from './TemaForm';
import "../../src/index.css";

const ThreeColumnLayout = ({ proyectoActual }) => {
  const [temas, setTemas] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [subtemaSeleccionado, setSubtemaSeleccionado] = useState(null);
  const [mostrarModalColeccion, setMostrarModalColeccion] = useState(false);
  const [mostrarModalTema, setMostrarModalTema] = useState(false);
  const [coleccionEditar, setColeccionEditar] = useState(null);
  const [coleccionExpandida, setColeccionExpandida] = useState(null);

 useEffect(() => {
  if (!proyectoActual?._id) return;  // ⚠️ espera a que el proyecto esté cargado

  const cargarTemas = async () => {
    try {
      const res = await axios.get(
        `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas?proyecto=${proyectoActual._id}`
      );
      setTemas(res.data);
    } catch (err) {
      console.error('Error al cargar temas:', err);
    }
  };

  cargarTemas();
}, [proyectoActual?._id]);


  const seleccionarTema = (tema) => {
    setTemaSeleccionado(tema);
    setSubtemaSeleccionado(null);
  };

  const seleccionarSubtema = (subtema) => {
    setSubtemaSeleccionado(subtema);
  };

  const abrirModalColeccion = (coleccion = null) => {
    setColeccionEditar(coleccion);
    setMostrarModalColeccion(true);
  };

  const cerrarModalColeccion = () => {
    setMostrarModalColeccion(false);
    setColeccionEditar(null);
  };

  const cerrarModalTema = () => {
    setMostrarModalTema(false);
  };

  const actualizarColeccion = (nuevaColeccion) => {
    const nuevosTemas = [...temas];
    const temaIdx = nuevosTemas.findIndex(t => t._id === temaSeleccionado?._id);
    if (temaIdx === -1) return;

    const subtemaIdx = nuevosTemas[temaIdx].subtemas?.findIndex(s => s._id === subtemaSeleccionado?._id);
    if (subtemaIdx === -1 || subtemaIdx === undefined) return;

    if (!Array.isArray(nuevosTemas[temaIdx].subtemas[subtemaIdx].colecciones)) {
      nuevosTemas[temaIdx].subtemas[subtemaIdx].colecciones = [];
    }

    if (coleccionEditar) {
      const colecciones = nuevosTemas[temaIdx].subtemas[subtemaIdx].colecciones;
      const idx = colecciones.findIndex(c => c._id === coleccionEditar._id);
      if (idx !== -1) {
        colecciones[idx] = { ...coleccionEditar, ...nuevaColeccion };
      }
    } else {
      nuevosTemas[temaIdx].subtemas[subtemaIdx].colecciones.push(nuevaColeccion);
    }

    setTemas(nuevosTemas);
    cerrarModalColeccion();
  };

  const eliminarColeccion = (coleccionId) => {
    const nuevosTemas = [...temas];
    const temaIdx = nuevosTemas.findIndex(t => t._id === temaSeleccionado._id);
    const subtemaIdx = nuevosTemas[temaIdx].subtemas.findIndex(s => s._id === subtemaSeleccionado._id);

    nuevosTemas[temaIdx].subtemas[subtemaIdx].colecciones =
      nuevosTemas[temaIdx].subtemas[subtemaIdx].colecciones.filter(c => c._id !== coleccionId);

    setTemas(nuevosTemas);
  };

  const abrirFormularioTema = () => {
    setMostrarModalTema(true);
  };

 const eliminarTema = async (id) => {
  const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este tema?');
  if (!confirmar) return;

  try {
    await axios.delete(`https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas/${id}`);
    alert('✅ Tema eliminado correctamente');
    await cargarTemas(); // Recargar la lista
  } catch (error) {
    console.error('❌ Error al eliminar tema:', error);
    alert('❌ Hubo un error al eliminar el tema');
  }
};


const guardarNuevoTema = async (nuevoTema) => {
  try {
    if (temaSeleccionado) {
      // PUT para actualizar un tema existente
      await axios.put(
        `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas/${temaSeleccionado._id}`,
        nuevoTema
      );
    } else {
      // POST para crear un nuevo tema
      await axios.post(
        'https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas',
        {
          ...nuevoTema,
          proyecto: '665ca5ef33e57e8b43f6b30e' // usa el ID de un proyecto válido
        }
      );
    }

    await cargarTemas(); // vuelve a traer desde Mongo
    cerrarModalTema();
    setTemaSeleccionado(null);
  } catch (error) {
    console.error('❌ Error al guardar tema:', error);
  }
};

  return (
    <div className="layout-container">
      {/* Sidebar Temas */}
      <div className="sidebar temas">
        <h4>Temas</h4>
        {temas.map(tema => (
          <div
            key={tema._id}
            className={`item ${temaSeleccionado?._id === tema._id ? 'selected' : ''}`}
            onClick={() => seleccionarTema(tema)}
          >
            <div className="item-header">
              <div className="item-title">{tema.nombre}</div>
              <div className="item-buttons">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTemaSeleccionado(tema);
                    setMostrarModalTema(true);
                  }}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarTema(tema._id);
                  }}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Subtemas */}
      <div className="sidebar subtemas">
        <h4>Subtemas</h4>
        {temaSeleccionado?.subtemas.map(subtema => (
          <div
            key={subtema._id}
            className={`item ${subtemaSeleccionado?._id === subtema._id ? 'selected' : ''}`}
            onClick={() => seleccionarSubtema(subtema)}
          >
            {subtema.nombre}
          </div>
        ))}
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <div className="header-row">
          <h4>Colecciones</h4>
          {subtemaSeleccionado && (
            <button onClick={() => abrirModalColeccion()}>+ Nueva colección</button>
          )}
        </div>

        {subtemaSeleccionado?.colecciones?.map((coleccion) => {
          let secciones = [];

          try {
            secciones = JSON.parse(coleccion.contenido);
            if (!Array.isArray(secciones)) {
              secciones = [{ tituloSecundario: '', contenido: coleccion.contenido }];
            }
          } catch (error) {
            secciones = [{ tituloSecundario: '', contenido: coleccion.contenido }];
          }

          const estaExpandida = coleccionExpandida === coleccion._id;

          return (
            <div key={coleccion._id} className="card">
              <div
                className="card-header"
                onClick={() => setColeccionExpandida(estaExpandida ? null : coleccion._id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: '#f1f1f1',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #ccc',
                }}
              >
                <h5 style={{ margin: 0 }}>{coleccion.nombre}</h5>
                <span>{estaExpandida ? '▲' : '▼'}</span>
              </div>

              {estaExpandida && (
                <div className="card-content" style={{ padding: '1rem' }}>
                  {secciones.map((sec, idx) => (
                    <div key={idx} className="coleccion-seccion" style={{ marginBottom: '1rem' }}>
                      <h4 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        marginTop: '0.5rem'
                      }}>
                        {sec.tituloSecundario}
                      </h4>
                      <div
                        className="card-content"
                        dangerouslySetInnerHTML={{ __html: sec.contenido }}
                      />
                    </div>
                  ))}
                  <div className="buttons" style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => abrirModalColeccion(coleccion)}>Editar</button>
                    <button onClick={() => eliminarColeccion(coleccion._id)}>Eliminar</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón flotante */}
      <button className="floating-button" onClick={abrirFormularioTema}>+</button>

      {/* Modales */}
      {mostrarModalColeccion && (
        <CollectionModal
          initialData={coleccionEditar}
           onSubmit={actualizarColeccion}
          onClose={cerrarModalColeccion}
        />
      )}
       {/* Modal de Tema */}
      {mostrarModalTema && (
        <TemaForm
          tema={temaSeleccionado}
          onSubmit={guardarNuevoTema}
          onClose={cerrarModalTema}
          proyectoActual={proyectoActual}
        />
      )}
    </div>
  );
};

export default ThreeColumnLayout;





