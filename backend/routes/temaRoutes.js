const express = require('express');
const Tema = require('../models/Tema');
const router = express.Router();



// GET /api/temas
router.get('/', async (req, res) => {
  try {
    const { proyecto } = req.query;
    const temas = proyecto
      ? await Tema.find({ proyecto })
      : await Tema.find();
    res.json(temas);
  } catch (err) {
    console.error('❌ Error al obtener temas:', err);
    res.status(500).json({ error: 'Error al obtener temas' });
  }
});
// ✅ POST /api/temas → crear un tema nuevo
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, subtemas, proyecto } = req.body;
    const nuevoTema = new Tema({ nombre, descripcion, subtemas, proyecto });
    const guardado = await nuevoTema.save();
    res.status(201).json(guardado);
  } catch (err) {
    console.error("❌ Error al crear tema:", err);
    res.status(500).json({ error: 'Error al crear tema', details: err.message });
  }
});
// rutas/temasRoutes.js
router.put('/:id', async (req, res) => {
  try {
    const tema = await Tema.findById(req.params.id);
    if (!tema) return res.status(404).json({ error: 'Tema no encontrado' });

    // actualizar campos simples
    if (req.body.nombre !== undefined) tema.nombre = req.body.nombre;
    if (req.body.descripcion !== undefined) tema.descripcion = req.body.descripcion;

    // actualizar subtemas (sobrescribimos el array completo)
    if (req.body.subtemas !== undefined) {
      tema.subtemas = req.body.subtemas;
    }

    // actualizar proyecto si llega
    if (req.body.proyecto !== undefined) {
      tema.proyecto = req.body.proyecto;
    }

    const actualizado = await tema.save();
    res.json(actualizado);
  } catch (err) {
    console.error("❌ Error al actualizar tema:", err);
    res.status(500).json({ error: 'Error al actualizar tema', details: err.message });
  }
});
// 📌 Eliminar un tema completo
router.delete('/:id', async (req, res) => {
  try {
    const tema = await Tema.findByIdAndDelete(req.params.id);

    if (!tema) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }

    res.json({ message: 'Tema eliminado correctamente', tema });
  } catch (err) {
    console.error("❌ Error al eliminar tema:", err);
    res.status(500).json({ error: 'Error al eliminar tema', details: err.message });
  }
});
/**

 */
/**
 * 📌 Crear una colección en un subtema
 */
router.post('/:temaId/subtemas/:subtemaId/colecciones', async (req, res) => {
  try {
    const { temaId, subtemaId } = req.params;
    const { nombre, contenido, imagenUrl } = req.body;

    const tema = await Tema.findById(temaId);
    if (!tema) return res.status(404).json({ error: 'Tema no encontrado' });

    const subtema = tema.subtemas.id(subtemaId);
    if (!subtema) return res.status(404).json({ error: 'Subtema no encontrado' });

    subtema.colecciones.push({ nombre, contenido, imagenUrl });
    await tema.save();

    const actualizado = await Tema.findById(temaId);
    return res.status(201).json(actualizado);
  } catch (err) {
    console.error("❌ Error al crear colección:", err);
    return res.status(500).json({ error: 'Error al crear colección', details: err.message });
  }
});

/**
 * 📌 Editar una colección en un subtema
 */
router.put('/:temaId/subtemas/:subtemaId/colecciones/:coleccionId', async (req, res) => {
  try {
    const { temaId, subtemaId, coleccionId } = req.params;
    const { nombre, contenido, imagenUrl } = req.body;

    const tema = await Tema.findById(temaId);
    if (!tema) return res.status(404).json({ error: 'Tema no encontrado' });

    const subtema = tema.subtemas.id(subtemaId);
    if (!subtema) return res.status(404).json({ error: 'Subtema no encontrado' });

    const coleccion = subtema.colecciones.id(coleccionId);
    if (!coleccion) return res.status(404).json({ error: 'Colección no encontrada' });

    // Actualizar solo campos presentes en req.body
    if (nombre !== undefined) coleccion.nombre = nombre;
    if (contenido !== undefined) coleccion.contenido = contenido;
    if (imagenUrl !== undefined) coleccion.imagenUrl = imagenUrl;

    await tema.save();

    const actualizado = await Tema.findById(temaId);
    return res.json(actualizado);
  } catch (err) {
    console.error("❌ Error al actualizar colección:", err);
    return res.status(500).json({ error: 'Error al actualizar colección', details: err.message });
  }
});

/**
 * 📌 Eliminar una colección en un subtema
 */
router.delete('/:temaId/subtemas/:subtemaId/colecciones/:coleccionId', async (req, res) => {
  try {
    const { temaId, subtemaId, coleccionId } = req.params;

    const tema = await Tema.findById(temaId);
    if (!tema) return res.status(404).json({ error: 'Tema no encontrado' });

    const subtema = tema.subtemas.id(subtemaId);
    if (!subtema) return res.status(404).json({ error: 'Subtema no encontrado' });

    // Filtrar en lugar de .remove() para mayor seguridad
    subtema.colecciones = subtema.colecciones.filter(
      c => c._id.toString() !== coleccionId
    );

    await tema.save();

    const actualizado = await Tema.findById(temaId);
    return res.json(actualizado);
  } catch (err) {
    console.error("❌ Error al eliminar colección:", err);
    return res.status(500).json({ error: 'Error al eliminar colección', details: err.message });
  }
});

// Eliminar colección
// Eliminar colección en un subtema
router.delete('/:temaId/subtemas/:subtemaId/colecciones/:coleccionId', async (req, res) => {
  try {
    const { temaId, subtemaId, coleccionId } = req.params;

    // 1) Cargar el tema
    const tema = await Tema.findById(temaId);
    if (!tema) return res.status(404).json({ error: 'Tema no encontrado' });

    // 2) Localizar subtema
    const subtema = tema.subtemas.id(subtemaId);
    if (!subtema) return res.status(404).json({ error: 'Subtema no encontrado' });

    // 3) Comprobar que la colección existe
    const coleccion = subtema.colecciones.id(coleccionId);
    if (!coleccion) return res.status(404).json({ error: 'Colección no encontrada' });

    // 4) Eliminar la colección filtrando (más seguro y compatible)
    subtema.colecciones = subtema.colecciones.filter(c => c._id.toString() !== coleccionId);

    // 5) Guardar cambios
    await tema.save();

    // 6) Releer el documento desde Mongo y devolverlo (así frontend siempre recibe la versión consistente)
    const actualizado = await Tema.findById(temaId);
    return res.json(actualizado);
  } catch (err) {
    console.error('❌ Error al eliminar colección:', err);
    return res.status(500).json({ error: 'Error al eliminar colección', details: err.message });
  }
});



module.exports = router;



