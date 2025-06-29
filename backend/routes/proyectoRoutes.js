// routes/proyectoRoutes.js
const express = require('express');
const Proyecto = require('../models/Proyecto');
const router = express.Router();

// GET todos los proyectos
router.get('/', async (req, res) => {
  try {
    const proyectos = await Proyecto.find();
    res.json(proyectos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

// GET un solo proyecto
router.get('/:id', async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ error: 'No encontrado' });
    res.json(proyecto);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
});

// POST nuevo proyecto
router.post('/', async (req, res) => {
  try {
    const nuevo = new Proyecto({ nombre: req.body.nombre });
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;
