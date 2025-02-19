const mongoose = require('mongoose');

const ColeccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contenido: { type: String, required: true }
});

const SubtemaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  colecciones: [ColeccionSchema]
});

const TemaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: String,
  subtemas: [SubtemaSchema]
});

const Tema = mongoose.model('Tema', TemaSchema);
module.exports = Tema;

