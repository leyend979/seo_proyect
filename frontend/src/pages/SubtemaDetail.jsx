import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import CollectionModal from '../components/CollectionModal';

const SubtemaDetail = () => {
  const { id, subIndex } = useParams();
  const [tema, setTema] = useState(null);
  const [subtema, setSubtema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  useEffect(() => {
    const fetchTema = async () => {
      try {
        const res = await axios.get(`https://ideal-potato-g4rjv7g56w4xhw7x9-5173.app.github.dev/api/temas/${id}`);
        setTema(res.data);
        const subIdx = parseInt(subIndex, 10);
        if (res.data.subtemas && res.data.subtemas.length > subIdx) {
          setSubtema(res.data.subtemas[subIdx]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el tema:', error);
        setLoading(false);
      }
    };
    fetchTema();
  }, [id, subIndex]);

  if (loading) return <p>Cargando...</p>;
  if (!tema || !subtema) return <p>No se encontró el subtema.</p>;

  const handleOpenModal = (collection = null) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const handleSaveCollection = async (newCollection) => {
    try {
      console.log("✅ Nueva colección a guardar:", newCollection);
  
      const updatedTema = { ...tema };
      const subtemaIndex = updatedTema.subtemas.findIndex(st => st._id === subtema._id);
      
      if (subtemaIndex === -1) {
        console.error("⛔ Subtema no encontrado en el tema.");
        return;
      }
  
      if (editingCollection) {
        updatedTema.subtemas[subtemaIndex].colecciones = updatedTema.subtemas[subtemaIndex].colecciones.map(col =>
          col._id === editingCollection._id ? newCollection : col
        );
      } else {
        updatedTema.subtemas[subtemaIndex].colecciones.push(newCollection);
      }
  
      console.log("📌 Tema actualizado antes de enviar:", updatedTema);
  
      const res = await axios.put(
        `https://ideal-potato-g4rjv7g56w4xhw7x9-5173.app.github.dev/api/temas/${tema._id}`,
        updatedTema
      );
  
      console.log("✅ Respuesta del servidor:", res.data);
  
      setTema(res.data);
      setSubtema(res.data.subtemas[subtemaIndex]);
  
      handleCloseModal();
    } catch (error) {
      console.error("⛔ Error al guardar la colección:", error);
    }
  };
  
  const handleDeleteCollection = async (collectionId) => {
    try {
      const updatedSubtemas = tema.subtemas.map((st) => {
        if (st._id === subtema._id) {
          return {
            ...st,
            colecciones: st.colecciones.filter((col) => col._id !== collectionId),
          };
        }
        return st;
      });
  
      await axios.put(`https://ideal-potato-g4rjv7g56w4xhw7x9-5173.app.github.dev/api/temas/${id}`, {
        ...tema,
        subtemas: updatedSubtemas,
      });
  
      setTema((prevTema) => ({ ...prevTema, subtemas: updatedSubtemas }));
      setSubtema(updatedSubtemas.find((st) => st._id === subtema._id));
    } catch (error) {
      console.error('Error al eliminar la colección:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Link to={`/temas/${id}`}>← Volver al tema</Link>
      <h2>{subtema.nombre}</h2>
      <p>Colecciones del subtema:</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {subtema.colecciones && subtema.colecciones.length > 0 ? (
          subtema.colecciones.map((coleccion) => {
            // Convertir contenido de string JSON a array de objetos
            const contenidoParsed = typeof coleccion.contenido === "string" 
              ? JSON.parse(coleccion.contenido) 
              : coleccion.contenido;

            return (
              <div 
                key={coleccion._id} 
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff',
                  textAlign: 'left', 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '350px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{coleccion.nombre}</h3>

                {coleccion.imagenUrl && (
                  <img 
                    src={coleccion.imagenUrl} 
                    alt={coleccion.nombre} 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '5px', marginBottom: '0.5rem' }}
                  />
                )}

<div 
  style={{ 
    display: 'flex', 
    flexWrap: 'nowrap', // Asegura que los elementos estén en una sola línea
    justifyContent: 'flex-start', // Alinea las secciones a la izquierda
    gap: '1rem', // Espaciado entre secciones
    width: 'auto', // La card crece con el contenido
    minWidth: '100%', // Asegura que no se reduzca más allá de su contenido
    overflowX: 'visible', // Evita scroll horizontal
  }}
>
  {Array.isArray(contenidoParsed) ? (
    contenidoParsed.map((seccion, index) => (
      <div 
        key={index} 
        style={{ 
          flex: '1',  // Todas las secciones ocupan el mismo ancho
          background: '#f9f9f9', 
          padding: '1rem', 
          borderRadius: '5px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '250px', // Evita que se achiquen demasiado
          whiteSpace: 'normal', // Asegura que el texto se ajuste bien
        }}
      >
        {seccion.tituloSecundario && (
          <h4 style={{ marginBottom: '0.5rem' }}>
            {seccion.tituloSecundario}
          </h4>
        )}
        <div dangerouslySetInnerHTML={{ __html: seccion.contenido }} />
      </div>
    ))
  ) : (
    <p style={{ color: '#999' }}>Sin información</p>
  )}
</div>



                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '1rem', 
                  position: 'absolute', 
                  bottom: '10px', 
                  left: 0, 
                  width: '100%'
                }}>
                  <button onClick={() => handleOpenModal(coleccion)}>✏️ Editar</button>
                  <button onClick={() => handleDeleteCollection(coleccion._id)}>🗑️ Eliminar</button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No hay colecciones en este subtema.</p>
        )}
      </div>

      <button className="boton-flotante" onClick={() => handleOpenModal()}>+</button>

      {isModalOpen && (
        <CollectionModal 
          onSubmit={handleSaveCollection} 
          initialData={editingCollection} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default SubtemaDetail;







