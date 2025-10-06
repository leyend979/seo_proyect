import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TemaForm = ({ onSubmit, tema, onClose, proyectoActual }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [subtemas, setSubtemas] = useState([]);

  useEffect(() => {
    if (tema && tema._id) {
      // 🔹 Modo edición → precarga datos
      setNombre(tema.nombre || '');
      setDescripcion(tema.descripcion || '');
      setSubtemas(tema.subtemas || []);
    } else {
      // 🔹 Modo creación → limpia campos
      setNombre('');
      setDescripcion('');
      setSubtemas([]);
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

  const handleRemoveSubtema = (idx) => {
    const nuevos = [...subtemas];
    nuevos.splice(idx, 1);
    setSubtemas(nuevos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 preserva _id en subtemas y colecciones
    const subtemasLimpios = (subtemas || []).map(st => ({
      _id: st._id, 
      nombre: st.nombre,
      colecciones: (st.colecciones || []).map(col => ({
        _id: col._id,
        nombre: col.nombre,
        contenido: col.contenido,
        imagenUrl: col.imagenUrl
      }))
    }));

    const payload = {
      _id: tema?._id,
      nombre,
      descripcion,
      subtemas: subtemasLimpios,
      proyecto: tema?._id 
        ? (tema.proyecto || proyectoActual?._id)
        : proyectoActual?._id
    };

    onSubmit(payload);
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
            <div key={subtema._id || idx} className="subtema-item">
              <input 
                type="text" 
                value={subtema.nombre} 
                onChange={(e) => handleChangeSubtema(idx, e.target.value)} 
                placeholder="Nombre del Subtema" 
                required 
              />
              <button type="button" onClick={() => handleRemoveSubtema(idx)}>🗑</button>
            </div>
          ))}

          <button 
            type="button" 
            onClick={handleAddSubtema}
            style={{ marginTop: '0.5rem' }}
          >
            + Agregar Subtema
          </button>

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

