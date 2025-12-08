const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // <-- importa CORS aquí arriba
const connectDB = require('./config/db');
const temaRoutes = require('./routes/temaRoutes');
const tituloRoutes = require('./routes/tituloRoutes');
const proyectoRoutes = require('./routes/proyectoRoutes');
const coleccionesRoutes = require('./routes/coleccionesRoutes');
const sheetsRoutes = require('./routes/sheetsRoutes');
const uploadRoutes = require('./routes/routesUpload');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));




dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// 👇 CORS debe ir ANTES de las rutas
const allowedOrigins = [
  'https://glorious-space-system-v64w69qgggp26xv-5174.app.github.dev',
  'http://localhost:5174',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("🚫 CORS bloqueado para origen:", origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
}));

app.options('*', cors()); // habilita preflight para todos los endpoints


// Rutas
app.use('/api/temas', temaRoutes);
app.use('/api/titulos', tituloRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/colecciones', coleccionesRoutes);
app.use('/api/sheetsRoutes', sheetsRoutes);
app.use('/api', uploadRoutes);

app.use((err, req, res, next) => {
  console.error("❌ Error global:", err.message);
  res.status(500).json({ message: err.message });
});

// PROXY PARA IMÁGENES DE GOOGLE DRIVE
// PROXY PARA IMÁGENES DE GOOGLE DRIVE
// PROXY PARA IMÁGENES DE GOOGLE DRIVE
// PROXY PARA IMÁGENES DE GOOGLE DRIVE
app.get("/proxy", async (req, res) => {
  console.log("📥 Proxy solicitado con ID:", req.query.id);
  
  try {
    const id = req.query.id;
    if (!id) return res.status(400).send("Missing ID");

    const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;

    const response = await fetch(driveUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
        "Accept": "image/avif,image/webp,*/*",
        "Accept-Language": "es-ES,es;q=0.9",
      }
    });

    if (!response.ok) {
      console.error("❌ Error al descargar desde Drive:", response.status);
      return res.status(500).send("Drive fetch failed");
    }

    res.setHeader("Content-Type", response.headers.get("content-type") || "application/octet-stream");
    res.send(Buffer.from(await response.arrayBuffer()));

  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).send("Proxy error");
  }
});






const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});


