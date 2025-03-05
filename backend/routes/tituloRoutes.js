const express = require('express');
const Titulo = require('../models/Titulo');

const router = express.Router();

// Middleware para parsear JSON (opcional si ya lo haces globalmente en server.js)
// router.use(express.json());

/**
 * GET /api/temas
 * Obtener todos los temas
 */
router.get('/', async (req, res) => {
  try {
    const titulos = await Titulo.find();
    res.json(titulos);
  } catch (error) {
    console.error("Error al obtener temas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// Ruta para obtener un tema individual por ID
router.get('/:id', async (req, res) => {
  try {
    const titulo = await Titulo.findById(req.params.id);
    if (!titulo) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }
    res.json(titulo);
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
    const { nombre, descripcion, subtitulos } = req.body;
    const nuevoTitulo = new Titulo({
      nombre,
      descripcion,
      subtitulos // Se espera que sea un arreglo de objetos { nombre, colecciones }
    });
    await nuevoTitulo.save();
    res.status(201).json({ mensaje: "Tema creado con éxito", tema: nuevoTitulo });
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
    const { nombre, descripcion, subtitulos } = req.body;
    const tituloActualizado = await Titulo.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, subtitulos },
      { new: true, runValidators: true }  // Retorna el documento actualizado y valida los campos
    );
    if (!tituloActualizado) {
      return res.status(404).json({ error: "Tema no encontrado" });
    }
    res.json(tituloActualizado);
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
    const tituloEliminado = await Tema.findByIdAndDelete(req.params.id);
    if (!tituloEliminado) {
      return res.status(404).json({ error: "Tema no encontrado" });
    }
    res.json({ mensaje: "Tema eliminado exitosamente", titulo: tituloEliminado });
  } catch (error) {
    console.error("Error al eliminar tema:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;