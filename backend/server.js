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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});


