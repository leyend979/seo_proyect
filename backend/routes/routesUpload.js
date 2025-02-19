// routes/upload.js
const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinayConfig');

const router = express.Router();
const upload = multer(); // Configuración en memoria

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió imagen' });
  }

  // Función para subir la imagen usando un stream
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  streamUpload(req)
    .then(result => res.json({ imageUrl: result.secure_url }))
    .catch(error => {
      console.error('Error al subir la imagen:', error);
      res.status(500).json({ error: 'Error al subir la imagen' });
    });
});

module.exports = router;
