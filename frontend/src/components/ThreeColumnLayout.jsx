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

const cargarTemas = async () => {
  if (!proyectoActual?._id) return;

  try {
    const res = await axios.get(
      `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas?proyecto=${proyectoActual._id}`
    );
    setTemas(res.data);
  } catch (err) {
    console.error('Error al cargar temas:', err);
  }
};

useEffect(() => {
  cargarTemas(); // ya disponible aquí
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

//actualizar coleccion



const actualizarColeccion = async (nuevaColeccion) => {
  if (!temaSeleccionado?._id || !subtemaSeleccionado?._id) return;

  try {
    let res;

    if (coleccionEditar?._id) {
      res = await axios.put(
        `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas/${temaSeleccionado._id}/subtemas/${subtemaSeleccionado._id}/colecciones/${coleccionEditar._id}`,
        nuevaColeccion
      );
    } else {
      res = await axios.post(
        `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas/${temaSeleccionado._id}/subtemas/${subtemaSeleccionado._id}/colecciones`,
        nuevaColeccion
      );
    }

    const temaActualizado = res.data;

    // Reemplazar el tema actualizado
    setTemas(prev =>
      prev.map(t => t._id === temaActualizado._id ? temaActualizado : t)
    );
    setTemaSeleccionado(temaActualizado);

    // 🔹 Actualizar también el subtema seleccionado
    const subtemaActualizado = temaActualizado.subtemas.find(
      s => s._id === subtemaSeleccionado._id
    );
    setSubtemaSeleccionado(subtemaActualizado);

    cerrarModalColeccion();
  } catch (error) {
    console.error("❌ Error al guardar colección:", error);
    alert("No se pudo guardar la colección.");
  }
};



// Eliminar una colección
const eliminarColeccion = async (coleccionId) => {
  if (!temaSeleccionado?._id || !subtemaSeleccionado?._id) return;
  const confirmar = window.confirm('¿Seguro que quieres eliminar esta colección?');
  if (!confirmar) return;

  try {
    const res = await axios.delete(
      `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas/${temaSeleccionado._id}/subtemas/${subtemaSeleccionado._id}/colecciones/${coleccionId}`
    );

    const temaActualizado = res.data;

    setTemas(prev =>
      prev.map(t => t._id === temaActualizado._id ? temaActualizado : t)
    );
    setTemaSeleccionado(temaActualizado);

    // 🔹 Refrescar el subtema seleccionado
    const subtemaActualizado = temaActualizado.subtemas.find(
      s => s._id === subtemaSeleccionado._id
    );
    setSubtemaSeleccionado(subtemaActualizado);
  } catch (error) {
    console.error("❌ Error al eliminar colección:", error);
    alert("No se pudo eliminar la colección.");
  }
};






  const abrirFormularioTema = () => {
    setMostrarModalTema(true);
    setTemaSeleccionado(null); // 🔹 Limpia tema seleccionado
  };


const eliminarTema = async (id) => {
  try {
    await axios.delete(`https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas/${id}`);
    setTemas(prev => prev.filter(t => t._id !== id));
    if (temaSeleccionado?._id === id) {
      setTemaSeleccionado(null);
    }
  } catch (error) {
    console.error("❌ Error al eliminar tema:", error);
  }
};



const guardarNuevoTema = async (nuevoTema) => {
  try {
    let data;
    if (nuevoTema._id && nuevoTema._id.length === 24) {
      // EDITAR
      const { _id, ...resto } = nuevoTema;
      const res = await axios.put(
        `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas/${_id}`,
        { ...resto, proyecto: proyectoActual._id }
      );
      data = res.data;

      setTemas(prev => prev.map(t => t._id === _id ? data : t));
    } else {
      // CREAR
      const { _id, ...resto } = nuevoTema;
      const res = await axios.post(
        `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas`,
        { ...resto, proyecto: proyectoActual._id }
      );
      data = res.data;

      setTemas(prev => [...prev, data]);
    }

    // 🔹 IMPORTANTE: refrescar también el tema seleccionado
    setTemaSeleccionado(data);

    cerrarModalTema();
  } catch (error) {
    console.error("❌ Error al guardar tema:", error);
  }
};



// `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas/${_id}`,
// `https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/temas`,




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
          console.log("📂 Colecciones de subtema:", subtemaSeleccionado?.colecciones);

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





