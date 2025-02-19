// src/components/AddCollectionForm.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Asegúrate de importar los estilos

const AddCollectionForm = ({ onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [contenido, setContenido] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !contenido) {
      alert('Debes completar todos los campos.');
      return;
    }
    onAdd({ nombre, contenido });
    setNombre('');
    setContenido('');
    setShowForm(false);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Botón para mostrar/ocultar el formulario */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Agregar Nueva Colección'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
          <h4>Agregar Nueva Colección</h4>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la colección"
              required
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label>Contenido:</label>
            {/* Usamos ReactQuill para un editor enriquecido */}
            <ReactQuill
              value={contenido}
              onChange={setContenido}
              placeholder="Escribe el contenido con formato (sangrados, viñetas, etc.)"
              modules={AddCollectionForm.modules}
              formats={AddCollectionForm.formats}
            />
          </div>
          <button type="submit" style={{ marginTop: '1rem' }}>Agregar Colección</button>
        </form>
      )}
    </div>
  );
};

// Configuración del editor (puedes personalizar estas opciones)
AddCollectionForm.modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ]
};

AddCollectionForm.formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

export default AddCollectionForm;

