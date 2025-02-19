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
        const res = await axios.get(`https://curly-meme-x5pr4447w5x6cpv49-5173.app.github.dev/api/temas/${id}`);
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

  // 🔹 Función para abrir el modal
  const handleOpenModal = (collection = null) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  // 🔹 Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  // 🔹 Función para guardar colección
  const handleSaveCollection = (newCollection) => {
    const updatedCollections = editingCollection
      ? subtema.colecciones.map((col) =>
          col.nombre === editingCollection.nombre ? newCollection : col
        )
      : [...(subtema.colecciones || []), newCollection];

    setSubtema({ ...subtema, colecciones: updatedCollections });
    handleCloseModal();
  };

  // 🔹 Función para eliminar colección
  const handleDeleteCollection = (nombre) => {
    const updatedCollections = subtema.colecciones.filter(col => col.nombre !== nombre);
    setSubtema({ ...subtema, colecciones: updatedCollections });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Link to={`/temas/${id}`}>← Volver al tema</Link>
      <h2>{subtema.nombre}</h2>
      <p>Colecciones del subtema:</p>

      {/* 🔹 Contenedor de Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {subtema.colecciones && subtema.colecciones.length > 0 ? (
          subtema.colecciones.map((coleccion, i) => (
            <div key={i} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
              textAlign: 'center'
            }}>
              {coleccion.imagenUrl && (
                <img 
                  src={coleccion.imagenUrl} 
                  alt={coleccion.nombre} 
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
                />
              )}
              <h3>{coleccion.nombre}</h3>
              <div dangerouslySetInnerHTML={{ __html: coleccion.contenido }} />

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-around' }}>
                <button onClick={() => handleOpenModal(coleccion)}>✏️ Editar</button>
                <button onClick={() => handleDeleteCollection(coleccion.nombre)}>🗑️ Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay colecciones en este subtema.</p>
        )}
      </div>

      <button onClick={() => handleOpenModal()} style={{ marginTop: '2rem' }}>+ Agregar</button>

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







