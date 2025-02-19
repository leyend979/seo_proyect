
//manejo de la colleción de cloudinary
const mongoose = require('mongoose');

const ColeccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contenido: { type: String, required: true },
  imagenUrl: { type: String }  // Nuevo campo para la URL de la imagen
});

module.exports = mongoose.model('Coleccion', ColeccionSchema);
