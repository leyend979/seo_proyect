// routes/routesUpload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config(); // 👈 Asegura que cargamos .env

// 🧩 Verifica que las variables existan al iniciar
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Error global: faltan variables de entorno de Cloudinary");
  console.error("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
  console.error("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
  console.error("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);
}

// ✅ Configuración correcta de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // 👈 nombres correctos
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🧰 Configuración de multer (almacenamiento temporal)
const upload = multer({ dest: "uploads/" });

// 🚀 Ruta de subida
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha enviado ningún archivo" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
  upload_preset: "seo_proyect", // ahora sí usamos el preset

});



    fs.unlinkSync(req.file.path);

    res.json({ imageUrl: result.secure_url });

  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;



