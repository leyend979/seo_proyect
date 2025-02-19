
const mongoose = require('mongoose');

// Flashcard Schema
const FlashcardSchema = new mongoose.Schema({
    pregunta: { type: String, required: true },
    respuesta: { type: String, required: true },
    temaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tema' },
  });
  
  module.exports = mongoose.model('Flashcard', FlashcardSchema);