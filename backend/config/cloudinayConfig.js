// config/cloudinaryConfig.js
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config(); // Asegúrate de tener dotenv configurado

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,       // ej: "midemo"
  api_key: process.env.CLOUDINARY_API_KEY,             // ej: "123456789012345"
  api_secret: process.env.CLOUDINARY_API_SECRET        // ej: "abcdefg1234567"
});

module.exports = cloudinary;
