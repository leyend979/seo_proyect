// controllers/temaController.js
const Tema = require('../models/Tema');

// Obtener todos los temas
exports.getTemas = async (req, res) => {
  try {
    const temas = await Tema.find();
    res.json(temas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los temas' });
  }
};

// Crear un nuevo tema
exports.createTema = async (req, res) => {
  try {
    const nuevoTema = new Tema(req.body);
    const tema = await nuevoTema.save();
    res.status(201).json(tema);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el tema' });
  }
};
