const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
  pregunta: { type: String, required: true },
  respuesta: { type: String, required: true },
  subtemaId: { type: mongoose.Schema.Types.ObjectId, ref: "Subtema", required: true }
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);

