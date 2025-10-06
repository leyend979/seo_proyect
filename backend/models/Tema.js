const mongoose = require('mongoose');

const ColeccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contenido: { type: String, required: true },
  imagenUrl: { type: String }
});

const SubtemaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  colecciones: {
    type: [ColeccionSchema],
    default: []
  }
});

const TemaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  subtemas: {
    type: [SubtemaSchema],
    default: []
  },
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true }
});

const Tema = mongoose.model('Tema', TemaSchema);
module.exports = Tema;

