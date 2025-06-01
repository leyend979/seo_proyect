// models/Proyecto.js
const mongoose = require('mongoose');
const TemaSchema = require('./Tema').schema; // Importa solo el esquema, no el modelo

const ProyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  temas: [TemaSchema]
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);

