import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TemaForm = ({ onSubmit, tema, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [subtemas, setSubtemas] = useState([]);

  useEffect(() => {
    console.log("Tema recibido:", tema);
    if (tema) {
      setNombre(tema.nombre || '');
      setDescripcion(tema.descripcion || '');
      setSubtemas(tema.subtemas || []);
    }
  }, [tema]);

  const handleAddSubtema = () => {
    setSubtemas([...subtemas, { nombre: '' }]);
  };

  const handleChangeSubtema = (idx, value) => {
    const newSubtemas = [...subtemas];
    newSubtemas[idx].nombre = value;
    setSubtemas(newSubtemas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, descripcion, subtemas });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>{tema ? 'Editar Tema' : 'Crear Nuevo Tema'}</h3>
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

          <h4>Subtemas</h4>
          {subtemas.map((subtema, idx) => (
            <div key={idx} className="subtema-item">
              <input 
                type="text" 
                value={subtema.nombre} 
                onChange={(e) => handleChangeSubtema(idx, e.target.value)} 
                placeholder="Nombre del Subtema" 
                required 
              />
            </div>
          ))}
          <button type="button" onClick={handleAddSubtema}>+ Agregar Subtema</button>
          <button type="button" onClick={() => handleRemoveSubtitulo(idx)}>🗑</button>

          <div className="buttons">
            <button type="submit">{tema ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemaForm;




