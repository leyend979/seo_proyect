const Flashcard = require('../models/flashcard.js');

// Obtener todas las flashcards
exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find().populate('tema');
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las flashcards' });
  }
};

// Crear una nueva flashcard
exports.createFlashcard = async (req, res) => {
  try {
    const { pregunta, respuesta, tema } = req.body;
    const nuevaFlashcard = new Flashcard({ pregunta, respuesta, tema });
    await nuevaFlashcard.save();
    res.status(201).json(nuevaFlashcard);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la flashcard' });
  }
};
