import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from './imagenUpload';

const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  ['code-block'],
  ['clean']
];

const CollectionModal = ({ onSubmit, initialData = null, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [secciones, setSecciones] = useState([{ tituloSecundario: '', contenido: '' }]);
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [contenido, setContenido] = useState('');
  

  const modalRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setImagenUrl(initialData.imagenUrl || '');

      try {
        const contenidoParsed = JSON.parse(initialData.contenido);
        if (Array.isArray(contenidoParsed)) {
          setSecciones(contenidoParsed);
        } else {
          setSecciones([{ tituloSecundario: '', contenido: contenidoParsed }]);
        }
      } catch (error) {
        console.warn('Contenido no es JSON válido, usando fallback');
        setSecciones([{ tituloSecundario: '', contenido: '' }]);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = modalRef.current.scrollHeight;
    }
  }, [secciones]);


const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (!nombre) {
    alert('El nombre de la colección es obligatorio.');
    return;
  }

  try {
    const nuevaColeccion = {
      nombre,
      contenido: JSON.stringify(secciones), // Las secciones son el "contenido"
      imagenUrl // si estás usando imágenes
    };

    const response = await fetch('https://glorious-space-system-v64w69qgggp26xv-5173.app.github.dev/api/colecciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaColeccion)
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos al servidor');
    }

    console.log('Guardado con éxito');
    onClose(); // Cierra el modal
  } catch (error) {
    console.error('Error al enviar datos:', error);
    alert('Hubo un error al guardar la colección.');
  }
};


  const handleChangeSeccion = (index, key, value) => {
    const updatedSecciones = [...secciones];
    updatedSecciones[index][key] = value;
    setSecciones(updatedSecciones);
  };

  const handleAddSeccion = () => {
    setSecciones([...secciones, { tituloSecundario: '', contenido: '' }]);
  };

  const handleRemoveSeccion = (index) => {
    if (secciones.length > 1) {
      setSecciones(secciones.filter((_, i) => i !== index));
    }
  };

const handleLoadFromSheet = () => {
  if (!sheetUrl || !sheetName) {
    alert('Debes proporcionar la URL del spreadsheet y el nombre de la hoja.');
    return;
  }

  // Construir la URL del iframe a partir del enlace de Sheets
  const sheetIdMatch = sheetUrl.match(/\/d\/(.*?)\//);
  const sheetId = sheetIdMatch ? sheetIdMatch[1] : null;

  if (!sheetId) {
    alert('URL del spreadsheet no válida');
    return;
  }

  const embedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:html&sheet=${encodeURIComponent(sheetName)}`;

  const iframeHTML = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0"></iframe>`;

  const nuevaSeccion = {
    tituloSecundario: 'Datos desde Google Sheets',
    contenido: iframeHTML
  };

  setSecciones([nuevaSeccion]); // o [...secciones, nuevaSeccion] si quieres añadirlo a lo anterior
};



  return (
    <Modal isOpen={true} onClose={onClose}>
      <div ref={modalRef} style={{ maxHeight: '80vh', overflowY: 'auto', padding: '1rem' }}>
        <h3>{initialData ? 'Editar Colección' : 'Agregar Nueva Colección'}</h3>
        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Título Global:</label><br />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>


          {/* NUEVO: Carga desde Google Sheets */}
          <div style={{ marginBottom: '1rem', border: '1px dashed #ccc', padding: '1rem' }}>
            <h4>Cargar desde Google Sheets</h4>
            <label>URL del Spreadsheet:</label>
            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <label>Nombre de la Hoja:</label>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="NombreHoja"
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <button type="button" onClick={handleLoadFromSheet} style={{ padding: '0.5rem', backgroundColor: '#28a745', color: 'white' }}>
              Cargar Tabla
            </button>
          </div>

          {secciones.map((seccion, index) => (
            <div key={index} style={{ marginBottom: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '5px' }}>
              <label>Título Secundario (opcional):</label><br />
              <input
                type="text"
                value={seccion.tituloSecundario}
                onChange={(e) => handleChangeSeccion(index, 'tituloSecundario', e.target.value)}
                style={{ width: '100%', padding: '0.5rem' }}
              />
              <label>Contenido:</label><br />
              <ReactQuill
                value={seccion.contenido}
                onChange={(value) => handleChangeSeccion(index, 'contenido', value)}
                modules={{ toolbar: toolbarOptions }}
                formats={[
                  'header',
                  'bold', 'italic', 'underline',
                  'list', 'bullet',
                  'link', 'image',
                  'code-block'
                ]}
              />
              {secciones.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSeccion(index)}
                  style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem', marginTop: '0.5rem' }}
                >
                  Eliminar sección
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSeccion}
            style={{ marginTop: '1rem', backgroundColor: '#007bff', color: 'white', padding: '0.5rem 1rem' }}
          >
            + Agregar Sección Manual
          </button>

          <ImageUpload onUpload={setImagenUrl} />
          {imagenUrl && (
            <div style={{ marginTop: '1rem' }}>
              <p>Vista previa:</p>
              <img src={imagenUrl} alt="Vista previa" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button onClick={onClose} type="button" style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem' }}>
              Cancelar
            </button>
            <button type="submit" style={{ backgroundColor: 'green', color: 'white', padding: '0.5rem 1rem' }}>
              Guardar Colección
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CollectionModal;






