import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddCollectionForm = ({ onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [contenido, setContenido] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetRange, setSheetRange] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !contenido) {
      alert('Debes completar todos los campos.');
      return;
    }
    onAdd({ nombre, contenido });
    setNombre('');
    setContenido('');
    setSheetUrl('');
    setSheetRange('');
    setShowForm(false);
  };

  const handleImportFromSheet = () => {
    // Simulación: Aquí podrías hacer fetch a una API o usar la Sheets API real
    const simulatedContent = `
      <h2>Contenido importado</h2>
      <ul>
        <li>Item 1 desde hoja</li>
        <li>Item 2 desde hoja</li>
      </ul>
    `;
    setContenido(simulatedContent);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
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
            <ReactQuill
              value={contenido}
              onChange={setContenido}
              placeholder="Escribe el contenido con formato (sangrados, viñetas, etc.)"
              modules={AddCollectionForm.modules}
              formats={AddCollectionForm.formats}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label>Google Sheets - URL:</label>
            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <label>Rango (ej: Hoja1!A2:B10):</label>
            <input
              type="text"
              value={sheetRange}
              onChange={(e) => setSheetRange(e.target.value)}
              placeholder="Hoja1!A2:B10"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <button
            type="button"
            onClick={handleImportFromSheet}
            style={{ marginTop: '0.5rem', backgroundColor: '#17a2b8', color: 'white', padding: '0.5rem 1rem' }}
          >
            📥 Importar desde Google Sheets
          </button>

          <div>
            <button type="submit" style={{ marginTop: '1rem' }}>Agregar Colección</button>
          </div>
        </form>
      )}
    </div>
  );
};

AddCollectionForm.modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
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


