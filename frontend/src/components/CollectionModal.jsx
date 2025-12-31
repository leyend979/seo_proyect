import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from './imagenUpload';
import Quill from 'quill';

const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  ['code-block'],
  ['clean']
];

// 🔥 FIX 1 — PERMITIR CUALQUIER URL DE IMAGEN (Drive)
const ImageFormat = Quill.import('formats/image');
ImageFormat.sanitize = url => url;
Quill.register(ImageFormat, true);


// -------------------------------------------------
// EXTRAER ID DE DRIVE
// -------------------------------------------------
const extraerIdDrive = (url) => {
  if (!url) return null;

  let match = url.match(/\/d\/([^/]+)/);
  if (match) return match[1];

  match = url.match(/[?&]id=([^&]+)/);
  if (match) return match[1];

  return null;
};

// -------------------------------------------------
// DRIVE URL → URL DIRECTA FUNCIONAL
// -------------------------------------------------
// ✔ Google Drive direct image URL FIX (2025)
const convertirDriveUrl = (url) => {
  const id = extraerIdDrive(url);
  if (!id) return url;

  // Nuevo endpoint que SÍ funciona
  return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
};


const CollectionModal = ({ onSubmit, initialData = null, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [secciones, setSecciones] = useState([{ tituloSecundario: '', contenido: '' }]);
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetName, setSheetName] = useState('');
  const modalRef = useRef(null);

  // Mantener refs de cada quill
  const quillRefs = useRef([]);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || '');
      setImagenUrl(initialData.imagenUrl || '');

      try {
        const parsed = JSON.parse(initialData.contenido);
        setSecciones(Array.isArray(parsed) ? parsed : [{ tituloSecundario: '', contenido: parsed }]);
      } catch {
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
    if (!nombre) return alert('El nombre es obligatorio.');

    const nuevaColeccion = {
      nombre,
      contenido: JSON.stringify(secciones),
      imagenUrl,
    };

    try {
      await onSubmit(nuevaColeccion);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la colección');
    }
  };

  const handleChangeSeccion = (index, key, value) => {
    const updated = [...secciones];
    updated[index][key] = value;
    setSecciones(updated);
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
    if (!sheetUrl || !sheetName) return alert('Proporciona URL y nombre de hoja');

    const match = sheetUrl.match(/\/d\/([^/]+)\//);
    const sheetId = match?.[1];
    if (!sheetId) return alert('URL inválida');

    const embedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:html&sheet=${encodeURIComponent(sheetName)}`;

    const iframeHTML = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0"></iframe>`;

    const nuevaSeccion = {
      tituloSecundario: 'Datos desde Google Sheets',
      contenido: iframeHTML,
    };

    setSecciones([nuevaSeccion]);
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

          {/* Google Sheets */}
          <div style={{ marginBottom: '1rem', border: '1px dashed #ccc', padding: '1rem' }}>
            <h4>Cargar desde Google Sheets</h4>

            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />

            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="NombreHoja"
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />

            <button
              type="button"
              onClick={handleLoadFromSheet}
              style={{ padding: '0.5rem', backgroundColor: '#28a745', color: 'white' }}
            >
              Cargar Tabla
            </button>
          </div>

          {secciones.map((sec, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>

              <input
                type="text"
                placeholder="Título Secundario (opcional)"
                value={sec.tituloSecundario}
                onChange={(e) => handleChangeSeccion(index, 'tituloSecundario', e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />

              {/* Campo de imagen */}
              <div style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Pegar enlace de imagen (Google Drive o URL)"
                  value={sec.tempImgUrl || ''}
                  onChange={(e) => {
                    const updated = [...secciones];
                    updated[index].tempImgUrl = e.target.value;
                    setSecciones(updated);
                  }}
                  style={{ flex: 1, padding: '0.4rem' }}
                />

                <button
                  type="button"
                  style={{ padding: '0.45rem 0.75rem', background: '#333', color: 'white' }}
                  onClick={() => {
                    const rawUrl = secciones[index].tempImgUrl;
                    if (!rawUrl) return alert('Pega un enlace primero.');

                    const finalUrl = convertirDriveUrl(rawUrl);

                    const quill = quillRefs.current[index];
                    if (!quill) return console.error("❌ Quill no encontrado en sección", index);

                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', finalUrl, 'user');
                  }}
                >
                  Insertar Imagen
                </button>
              </div>

              <ReactQuill
                theme="snow"
                value={sec.contenido}
                onChange={(value) => handleChangeSeccion(index, 'contenido', value)}
                modules={{ toolbar: toolbarOptions }}
                ref={(el) => {
                  if (el && el.getEditor) {
                    quillRefs.current[index] = el.getEditor();
                  }
                }}
              />

              {secciones.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSeccion(index)}
                  style={{ backgroundColor: 'red', color: 'white', marginTop: '0.5rem' }}
                >
                  Eliminar sección
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSeccion}
            style={{ marginTop: '1rem', backgroundColor: '#007bff', color: 'white' }}
          >
            + Agregar Sección Manual
          </button>

          <ImageUpload onUpload={setImagenUrl} />

          {imagenUrl && (
            <div style={{ marginTop: '1rem' }}>
              <img src={imagenUrl} alt="Vista previa" style={{ maxWidth: '100%' }} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ backgroundColor: 'red', color: 'white' }}>
              Cancelar
            </button>

            <button type="submit" style={{ backgroundColor: 'green', color: 'white' }}>
              Guardar Colección
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CollectionModal;
