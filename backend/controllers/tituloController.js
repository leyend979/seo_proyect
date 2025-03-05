// controllers/temaController.js
const Titulo = require('../models/Titulo');

// Obtener todos los temas
exports.getTitulos = async (req, res) => {
  try {
    const titulos = await Tema.find();
    res.json(titulos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los temas' });
  }
};

// Crear un nuevo tema
exports.createTitulo = async (req, res) => {
  try {
    const nuevoTitulo = new Titulo(req.body);
    const titulo = await nuevoTitulo.save();
    res.status(201).json(titulo);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el tema' });
  }
};