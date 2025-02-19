// src/components/ImageUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Maneja el cambio en el input file
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Función para subir la imagen al endpoint /api/upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Cambia 'https://tu-backend-url' por la URL real de tu backend
      const response = await axios.post(
        'https://tu-backend-url/api/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      // Suponemos que el endpoint devuelve { imageUrl: "https://..." }
      const url = response.data.imageUrl;
      setImageUrl(url);
      // Notificamos al componente padre con la URL obtenida
      onUpload(url);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <input type="file" onChange={handleFileChange} />
      <button 
        onClick={handleUpload} 
        disabled={uploading || !selectedFile}
        style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}
      >
        {uploading ? 'Subiendo...' : 'Subir Imagen'}
      </button>
      {imageUrl && (
        <div style={{ marginTop: '1rem' }}>
          <img
            src={imageUrl}
            alt="Vista previa"
            style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
