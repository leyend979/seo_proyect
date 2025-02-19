import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from './imagenUpload';

const CollectionModal = ({ onSubmit, initialData = null, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setImagenUrl(initialData.imagenUrl || '');

      if (quillRef.current) {
        quillRef.current.getEditor().root.innerHTML = initialData.contenido || '';
      }
    }
  }, [initialData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const contenido = quillRef.current?.getEditor().root.innerHTML || '';

    if (!nombre || !contenido) return;
    onSubmit({ nombre, contenido, imagenUrl });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h3>{initialData ? 'Editar Colección' : 'Agregar Nueva Colección'}</h3>
      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nombre:</label><br/>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Contenido:</label><br/>
          <ReactQuill ref={quillRef} placeholder="Escribe aquí..." />
        </div>

        <ImageUpload onUpload={setImagenUrl} />

        {imagenUrl && (
          <div style={{ marginTop: '1rem' }}>
            <p>Vista previa:</p>
            <img src={imagenUrl} alt="Vista previa" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem' }}>
            Cancelar
          </button>
          <button type="submit" style={{ backgroundColor: 'green', color: 'white', padding: '0.5rem 1rem' }}>
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CollectionModal;




