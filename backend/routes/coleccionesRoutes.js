const express = require('express');
const router = express.Router();
const Coleccion = require('../models/colection'); // Asegúrate de que la ruta esté correcta

// Obtener todas las colecciones
router.get('/', async (req, res) => {
  try {
    const colecciones = await Coleccion.find();
    res.json(colecciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener colecciones' });
  }
});

// Crear una nueva colección
router.post('/', async (req, res) => {
  try {
    const nuevaColeccion = new Coleccion({
      nombre: req.body.nombre,
      contenido: req.body.contenido,
      imagenUrl: req.body.imagenUrl || ''
    });

    const guardada = await nuevaColeccion.save();
    res.status(201).json(guardada);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear la colección', details: err.message });
  }
});

// Obtener una colección por ID (opcional)
router.get('/:id', async (req, res) => {
  try {
    const coleccion = await Coleccion.findById(req.params.id);
    if (!coleccion) return res.status(404).json({ error: 'Colección no encontrada' });
    res.json(coleccion);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar la colección' });
  }
});

// Actualizar una colección
router.put('/:id', async (req, res) => {
  try {
    const actualizada = await Coleccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar la colección' });
  }
});

// Eliminar una colección
router.delete('/:id', async (req, res) => {
  try {
    await Coleccion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Colección eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la colección' });
  }
});

module.exports = router;
