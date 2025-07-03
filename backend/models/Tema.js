const mongoose = require('mongoose');

const ColeccionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contenido: { type: String, required: true }
});

const SubtemaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  colecciones: {
    type: [ColeccionSchema],
    default: [] // ✅ asegura que siempre haya un array, aunque esté vacío
  }
});

const TemaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  subtemas: [SubtemaSchema],
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true } // ✅ AÑADE ESTO
});




const Tema = mongoose.model('Tema', TemaSchema);
module.exports = Tema;

