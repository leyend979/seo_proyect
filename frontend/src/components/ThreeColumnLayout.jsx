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
    if (proyectoActual?._id) {
      setTemaSeleccionado(null);
      setSubtemaSeleccionado(null);
      setTemas([]); // Limpia también para evitar flicker de datos antiguos
      cargarTemas(); // Vuelve a cargar temas del nuevo proyecto
    }
  }, [proyectoActual]);


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
  cerrarModalColeccion();
  cargarTemas(); // 🔁 Aquí recargas los datos reales desde el backend
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

  const eliminarTema = (temaId) => {
    const nuevosTemas = temas.filter(t => t._id !== temaId);
    setTemas(nuevosTemas);
    if (temaSeleccionado?._id === temaId) {
      setTemaSeleccionado(null);
      setSubtemaSeleccionado(null);
    }
  };

  const guardarNuevoTema = async (nuevoTema) => {
  try {
    const res = await axios.post('https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas', nuevoTema);
    setTemas([...temas, res.data]);
    cerrarModalTema();
    setTemaSeleccionado(null);
  } catch (err) {
    console.error('Error al guardar el tema:', err);
  }
};

  const cargarTemas = () => {
  axios.get('https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas')
    .then(res => {
      const filtrados = res.data.filter(t => t.proyecto === proyectoActual._id);
      setTemas(filtrados);
    })
    .catch(err => console.error('Error al cargar temas:', err));
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





