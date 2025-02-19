const express = require("express");
const Flashcard = require("../models/Flashcard");

const router = express.Router();

// Obtener todas las flashcards
router.get("/", async (req, res) => {
  const flashcards = await Flashcard.find();
  res.json(flashcards);
});

// Crear una nueva flashcard
router.post("/", async (req, res) => {
  const nuevaFlashcard = new Flashcard({
    pregunta: req.body.pregunta,
    respuesta: req.body.respuesta,
  });
  await nuevaFlashcard.save();
  res.status(201).json(nuevaFlashcard);
});

module.exports = router;
