import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TemaForm = ({ onSubmit, tema, onClose, proyectoActual }) => {

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [subtemas, setSubtemas] = useState([]);

  useEffect(() => {
  console.log("Tema recibido:", tema);

  if (tema && tema._id) {
    // Modo edición → rellena con datos existentes
    setNombre(tema.nombre || '');
    setDescripcion(tema.descripcion || '');
    setSubtemas(tema.subtemas || []);
  } else {
    // Modo creación → limpia los campos
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

  // Preserva _id de subtemas y colecciones si existen
  const subtemasLimpios = (subtemas || []).map(st => ({
    _id: st._id,                  // <-- conserva id si viene de Mongo
    nombre: st.nombre,
    colecciones: (st.colecciones || []).map(col => ({
      _id: col._id,               // <-- conserva id de la colección
      nombre: col.nombre,
      contenido: col.contenido
    }))
  }));

  const payload = {
    _id: tema?._id,                              // <-- CLAVE: enviar _id si estás editando
    nombre,
    descripcion,
    subtemas: subtemasLimpios,
    // si estás creando usa el proyectoActual; si editas, conserva el del tema
    proyecto: tema?._id ? (tema.proyecto || proyectoActual?._id) : proyectoActual?._id
  };

  // console.log('payload TemaForm =>', payload); // útil para depurar
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
          <div key={idx} className="subtema-item">
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
          <button type="button" onClick={handleAddSubtema}>+ Agregar Subtema</button>
          <button type="button" onClick={() => handleRemoveSubtema(idx)}>🗑</button>

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




