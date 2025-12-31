const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const temaRoutes = require('./routes/temaRoutes');
const tituloRoutes = require('./routes/tituloRoutes');
const proyectoRoutes = require('./routes/proyectoRoutes');
const coleccionesRoutes = require('./routes/coleccionesRoutes');
const sheetsRoutes = require('./routes/sheetsRoutes');
const uploadRoutes = require('./routes/routesUpload');

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

/**
 * ✅ CORS SIMPLE
 * Al servir frontend y backend desde el mismo dominio,
 * no necesitas configurar orígenes.
 */
app.use(cors());

/* =======================
   API ROUTES
======================= */
app.use('/api/temas', temaRoutes);
app.use('/api/titulos', tituloRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/colecciones', coleccionesRoutes);
app.use('/api/sheetsRoutes', sheetsRoutes);
app.use('/api', uploadRoutes);

/* =======================
   PROXY GOOGLE DRIVE
======================= */
app.get('/proxy', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).send('Missing ID');

    const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;
    const response = await fetch(driveUrl);

    if (!response.ok) {
      return res.status(500).send('Drive fetch failed');
    }

    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'application/octet-stream'
    );

    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    console.error('❌ Proxy error:', err);
    res.status(500).send('Proxy error');
  }
});

/* =======================
   FRONTEND (VITE BUILD)
======================= */
const frontendPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

/* =======================
   ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err.message);
  res.status(500).json({ message: err.message });
});

/* =======================
   SERVER
======================= */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});



