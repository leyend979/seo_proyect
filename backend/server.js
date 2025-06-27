const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const temaRoutes = require('./routes/temaRoutes');
const tituloRoutes = require('./routes/tituloRoutes');
const proyectoRoutes = require('./routes/proyectoRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const coleccionesRoutes = require('./routes/coleccionesRoutes'); // Ruta al archivo que acabas de crear
const sheetsRoutes = require('./routes/sheetsRoutes'); // Ruta al archivo que acabas de crear
const uploadRoutes = require('./routes/routesUpload'); // Importa la ruta de subida


// Configuración de variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();
app.use(express.json()); // Middleware para parsear JSON

//habilitar cors
const cors = require('cors');

const allowedOrigins = [
  'https://glorious-space-system-v64w69qgggp26xv-5174.app.github.dev', // tu frontend
  'http://localhost:5174' // opcional, para desarrollo local
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // si usas cookies o auth headers
}));

// Rutas
app.use('/api/temas', temaRoutes);
app.use('/api/titulos', tituloRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/colecciones', coleccionesRoutes);
app.use('/api/sheetsRoutes', sheetsRoutes);

//app.use('/api/flashcards', flashcardRoutes);
app.use('/api', uploadRoutes); // Esto montará el endpoint /api/upload

// Middleware para manejar errores
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

