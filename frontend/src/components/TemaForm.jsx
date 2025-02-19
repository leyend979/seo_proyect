// src/components/TemaForm.jsx
import React, { useState } from 'react';

const TemaForm = ({ onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  // Para este ejemplo, podemos iniciar con un subtema y algunas colecciones
  const [subtemas, setSubtemas] = useState([
    {
      nombre: '',
      colecciones: [
        { nombre: '', contenido: '' },
        { nombre: '', contenido: '' },
        { nombre: '', contenido: '' }
      ]
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enviar los datos al callback onSubmit del padre
    onSubmit({ nombre, descripcion, subtemas });
    // Limpiar el formulario (opcional)
    setNombre('');
    setDescripcion('');
    setSubtemas([
      {
        nombre: '',
        colecciones: [
          { nombre: '', contenido: '' },
          { nombre: '', contenido: '' },
          { nombre: '', contenido: '' }
        ]
      }
    ]);
  };

  // Nota: Aquí solo hacemos un formulario sencillo. Puedes extenderlo para agregar más subtemas y colecciones dinámicamente.

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>Crear Nuevo Tema</h3>
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
        <textarea 
          value={descripcion} 
          onChange={(e) => setDescripcion(e.target.value)} 
          rows={3}
        ></textarea>
      </div>
      <h4>Subtema 1</h4>
      <div>
        <label>Nombre del Subtema:</label>
        <input 
          type="text" 
          value={subtemas[0].nombre} 
          onChange={(e) => {
            const newSubtemas = [...subtemas];
            newSubtemas[0].nombre = e.target.value;
            setSubtemas(newSubtemas);
          }} 
          required
        />
      </div>
      <h5>Colecciones</h5>
      {subtemas[0].colecciones.map((col, idx) => (
        <div key={idx} style={{ marginBottom: '1rem' }}>
          <div>
            <label>Nombre de la Colección:</label>
            <input 
              type="text" 
              value={col.nombre} 
              onChange={(e) => {
                const newSubtemas = [...subtemas];
                newSubtemas[0].colecciones[idx].nombre = e.target.value;
                setSubtemas(newSubtemas);
              }} 
              required
            />
          </div>
          <div>
            <label>Contenido:</label>
            <input 
              type="text" 
              value={col.contenido} 
              onChange={(e) => {
                const newSubtemas = [...subtemas];
                newSubtemas[0].colecciones[idx].contenido = e.target.value;
                setSubtemas(newSubtemas);
              }} 
              required
            />
          </div>
        </div>
      ))}
      <button type="submit">Crear Tema</button>
    </form>
  );
};

export default TemaForm;
