import express from "express"
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConnectDB } from "./config/db.js"
import routerCervezas from "./routes/routesCervezas.js"
import routerVinos from "./routes/routesVinos.js"
import authRoutes from './routes/authRoutes.js';
import routerPedidos from './routes/routesPedidos.js';
import routerUsuaris from './routes/routesUsuaris.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

ConnectDB();

const app = express();

// CORS mejorado
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',      // Vite local
    'http://localhost:3000',      // Local
    'http://localhost:5000',      // Alternativo
    process.env.FRONTEND_URL,     // Desde .env
  ].filter(Boolean);

  const origin = req.headers.origin;
  
  // Permitir cualquier origen en desarrollo, específicos en producción
  if (!process.env.FRONTEND_URL || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
<<<<<<< HEAD
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
=======
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '3600');
  
>>>>>>> 1ba7378dea796a99d8195da2aef2a0a23f272aa8
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

<<<<<<< HEAD
// Middleware JSON y URL encoded (ANTES de multer)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
=======
// Middleware para parsear JSON y FormData
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
>>>>>>> 1ba7378dea796a99d8195da2aef2a0a23f272aa8

// Middleware de error para JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  next(err);
});

// Rutas
app.use("/api/cervezas", routerCervezas);
app.use("/api/vinos", routerVinos);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', routerPedidos);
app.use('/api/usuaris', routerUsuaris);

app.get("/", (req, res) => {
  res.json({ mensaje: "API Vinacoteca activa", version: "2.0" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
