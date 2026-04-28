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

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Middleware JSON
app.use(express.json());

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
