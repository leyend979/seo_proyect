const express = require('express');
const Tema = require('../models/Tema');

const router = express.Router();

// Middleware para parsear JSON (opcional si ya lo haces globalmente en server.js)
// router.use(express.json());

/**
 * GET /api/temas
 * Obtener todos los temas
 */
router.get('/', async (req, res) => {
  try {
    const { proyecto } = req.query;
    const temas = proyecto
      ? await Tema.find({ proyecto })
      : await Tema.find();
    res.json(temas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener temas' });
  }
});
// Ruta para obtener un tema individual por ID
router.get('/:id', async (req, res) => {
  try {
    const tema = await Tema.findById(req.params.id);
    if (!tema) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }
    res.json(tema);
  } catch (error) {
    console.error("Error al obtener el tema:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


/**
 * POST /api/temas
 * Crear un nuevo tema con subtemas y colecciones
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, subtemas, proyecto } = req.body;
    const nuevoTema = new Tema({ nombre, descripcion, subtemas, proyecto });
    const guardado = await nuevoTema.save();
    res.status(201).json(guardado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * PUT /api/temas/:id
 * Actualizar un tema completo (incluyendo subtemas y colecciones)
 */
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, subtemas } = req.body;
    const temaActualizado = await Tema.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, subtemas },
      { new: true, runValidators: true }  // Retorna el documento actualizado y valida los campos
    );
    if (!temaActualizado) {
      return res.status(404).json({ error: "Tema no encontrado" });
    }
    res.json(temaActualizado);
  } catch (error) {
    console.error("Error al actualizar tema:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * DELETE /api/temas/:id
 * Eliminar un tema por su ID
 */
// Eliminar un tema por ID
router.delete('/:id', async (req, res) => {
  console.log('🧪 Recibido DELETE con ID:', req.params.id);
  try {
    const temaEliminado = await Tema.findByIdAndDelete(req.params.id);
    if (!temaEliminado) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }
    res.json({ message: 'Tema eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar tema:', err);
    res.status(500).json({ error: 'Error al eliminar tema' });
  }
});

module.exports = router;


