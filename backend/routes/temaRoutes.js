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
    const temas = await Tema.find();
    res.json(temas);
  } catch (error) {
    console.error("Error al obtener temas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
    const { nombre, descripcion, subtemas } = req.body;
    const nuevoTema = new Tema({
      nombre,
      descripcion,
      subtemas // Se espera que sea un arreglo de objetos { nombre, colecciones }
    });
    await nuevoTema.save();
    res.status(201).json({ mensaje: "Tema creado con éxito", tema: nuevoTema });
  } catch (error) {
    console.error("Error al guardar tema:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
router.delete('/:id', async (req, res) => {
  try {
    const temaEliminado = await Tema.findByIdAndDelete(req.params.id);
    if (!temaEliminado) {
      return res.status(404).json({ error: "Tema no encontrado" });
    }
    res.json({ mensaje: "Tema eliminado exitosamente", tema: temaEliminado });
  } catch (error) {
    console.error("Error al eliminar tema:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;


