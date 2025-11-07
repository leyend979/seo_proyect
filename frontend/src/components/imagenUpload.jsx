// src/components/ImageUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACK_URL;

const ImageUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile); // 👈 se usa el archivo del estado

    try {
      setUploading(true);
      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Imagen subida:", res.data);
      setImageUrl(res.data.imageUrl);
      if (onUpload) onUpload(res.data.imageUrl);
    } catch (error) {
      console.error("❌ Error al subir la imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
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
            style={{ maxWidth: '100%', border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

