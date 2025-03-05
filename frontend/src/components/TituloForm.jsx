import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TituloForm = ({ onSubmit, titulo, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [subtitulos, setSubtitulos] = useState([]);

  useEffect(() => {
    console.log("Título recibido:", titulo);
    if (titulo) {
      setNombre(titulo.nombre || '');
      setDescripcion(titulo.descripcion || '');
      setSubtitulos(titulo.subtitulos || []); // Cargar subtítulos si existen
    } else {
      // Si es un nuevo título, limpiamos los campos
      setNombre('');
      setDescripcion('');
      setSubtitulos([]);
    }
  }, [titulo]);

  const handleAddSubtitulo = () => {
    setSubtitulos([...subtitulos, { nombre: '' }]);
  };

  const handleRemoveSubtitulo = (index) => {
    setSubtitulos(subtitulos.filter((_, idx) => idx !== index));
  };

  const handleSubtituloChange = (index, newValue) => {
    const nuevosSubtitulos = [...subtitulos];
    nuevosSubtitulos[index].nombre = newValue;
    setSubtitulos(nuevosSubtitulos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    const nuevoTitulo = {
      nombre,
      descripcion,
      subtitulos,
    };

    console.log("Enviando título:", nuevoTitulo);
    onSubmit(nuevoTitulo);

    // Limpiar el formulario después de crear
    setNombre('');
    setDescripcion('');
    setSubtitulos([]);
    onClose(); // Cerrar modal después de crear
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>{titulo ? 'Editar Título' : 'Crear Nuevo Título'}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Descripción:</label>
            <ReactQuill value={descripcion} onChange={setDescripcion} />
          </div>

          {/* Subtítulos */}
          <h4>Subtítulos</h4>
          {subtitulos.map((subtitulo, idx) => (
            <div key={idx} className="subtitulo-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input 
                type="text" 
                value={subtitulo.nombre} 
                onChange={(e) => handleSubtituloChange(idx, e.target.value)}
                placeholder="Nombre del Subtítulo"
                required 
                style={{ flex: 1, marginRight: '10px' }}
              />
              <button type="button" onClick={() => handleRemoveSubtitulo(idx)}>🗑</button>
            </div>
          ))}

          <button type="button" onClick={handleAddSubtitulo} style={{ marginBottom: '10px' }}>+ Agregar Subtítulo</button>

          <div className="buttons">
            <button type="submit">{titulo ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TituloForm;


