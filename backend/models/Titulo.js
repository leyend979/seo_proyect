const mongoose = require('mongoose');

const ColeccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contenido: { type: String, required: true }
});

const SubtituloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  colecciones: [ColeccionSchema]
});

const TituloSchema = new mongoose.Schema({
  nombre: { type: String, required: true},
  descripcion: String,
  subtitulos: [SubtituloSchema]
});

const Titulo = mongoose.model('Titulo', TituloSchema);
module.exports = Titulo;