const express = require('express');
const router = express.Router();
const { getSheetData, appendToSheet } = require('../config/sheetsService');

// Leer datos
router.get('/api/colecciones', async (req, res) => {
  try {
    const data = await getSheetData('SPREADSHEET_ID', 'Hoja1!A:C');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al leer Google Sheets');
  }
});

// Agregar una colección
router.post('/api/colecciones', async (req, res) => {
  const { nombre, contenido } = req.body;
  if (!nombre || !contenido) {
    return res.status(400).send('Faltan campos');
  }

  try {
    await appendToSheet('SPREADSHEET_ID', 'Hoja1!A:B', [nombre, contenido]);
    res.send('Agregado con éxito');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al escribir en Google Sheets');
  }
});

module.exports = router;
