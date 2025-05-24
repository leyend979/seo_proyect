import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CollectionModal from './CollectionModal';
import TemaForm from './TemaForm';
import "../../src/index.css";

const ThreeColumnLayout = () => {
  const [temas, setTemas] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [subtemaSeleccionado, setSubtemaSeleccionado] = useState(null);
  const [mostrarModalColeccion, setMostrarModalColeccion] = useState(false);
  const [mostrarModalTema, setMostrarModalTema] = useState(false);
  const [coleccionEditar, setColeccionEditar] = useState(null);

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
    const temaIdx = nuevosTemas.findIndex(t => t._id === temaSeleccionado._id);
    const subtemaIdx = nuevosTemas[temaIdx].subtemas.findIndex(s => s._id === subtemaSeleccionado._id);

    if (coleccionEditar) {
      const colecciones = nuevosTemas[temaIdx].subtemas[subtemaIdx].colecciones;
      const idx = colecciones.findIndex(c => c._id === coleccionEditar._id);
      colecciones[idx] = { ...coleccionEditar, ...nuevaColeccion };
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

  const eliminarTema = (temaId) => {
    const nuevosTemas = temas.filter(t => t._id !== temaId);
    setTemas(nuevosTemas);
    if (temaSeleccionado?._id === temaId) {
      setTemaSeleccionado(null);
      setSubtemaSeleccionado(null);
    }
  };

  const guardarNuevoTema = (nuevoTema) => {
    if (temaSeleccionado) {
      const nuevosTemas = temas.map(t =>
        t._id === temaSeleccionado._id ? { ...t, ...nuevoTema } : t
      );
      setTemas(nuevosTemas);
    } else {
      const temaConId = {
        _id: Date.now().toString(),
        ...nuevoTema
      };
      setTemas([...temas, temaConId]);
    }

    cerrarModalTema();
    setTemaSeleccionado(null);
  };
  

  return (
    <div className="layout-container">
      {/* Sidebar de Temas */}
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

      {/* Sidebar de Subtemas */}
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
        <div className="header">
          <h4>Colecciones</h4>
          {subtemaSeleccionado && (
            <button onClick={() => abrirModalColeccion()}>+ Nueva colección</button>
          )}
        </div>
        
        {subtemaSeleccionado?.colecciones?.map(coleccion => {
          let secciones = [];

          try {
            secciones = JSON.parse(coleccion.contenido);
            if (!Array.isArray(secciones)) {
              secciones = [{ tituloSecundario: '', contenido: coleccion.contenido }];
            }
          } catch (error) {
            secciones = [{ tituloSecundario: '', contenido: coleccion.contenido }];
          }

          return (
            <div key={coleccion._id} className="card">
              <h5>{coleccion.nombre}</h5>
              <div className="card-content">
                {secciones.map((sec, idx) => (
                  <div key={idx} className="coleccion-seccion">
                    {sec.tituloSecundario && <h6>{sec.tituloSecundario}</h6>}
                    <div dangerouslySetInnerHTML={{ __html: sec.contenido }} />
                  </div>
                ))}
              </div>
              <div className="buttons">
                <button onClick={() => abrirModalColeccion(coleccion)}>Editar</button>
                <button onClick={() => eliminarColeccion(coleccion._id)}>Eliminar</button>
              </div>
            </div>
          );
        })}

      </div>

      {/* Botón flotante para nuevo tema */}
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
          onSubmit={guardarNuevoTema}
          onClose={cerrarModalTema}
          tema={temaSeleccionado}
        />
      )}
    </div>
  );
};

export default ThreeColumnLayout;




