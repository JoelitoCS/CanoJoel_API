import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Usuario from '../modelos/modeloUsuarios.js';
import { protegir } from '../middlewares/authMiddleware.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuración de Multer para fotos de perfil
// Usar memoria en producción, disco en desarrollo
const storage = multer.memoryStorage(); // Guardamos en memoria primero

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipus de fitxer no permès. Només imatges (jpeg, png, webp, gif)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});

// Función para convertir buffer a Base64
const bufferToBase64 = (buffer, mimetype) => {
  if (!buffer) return '';
  const base64 = buffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
};

// POST /api/auth/registro
router.post('/registro', upload.single('foto'), async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    
    console.log('📝 Datos recibidos:', { email, password: '***', nombre, hasFoto: !!req.file });
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email i contrasenya requerits' });
    }
    
    const existent = await Usuario.findOne({ email });
    if (existent) {
      return res.status(400).json({ error: 'Aquest email ja està registrat' });
    }
    
    // Convertir archivo a Base64 si existe
    let fotoBase64 = '';
    if (req.file) {
      console.log('📸 Archivo recibido:', { mimetype: req.file.mimetype, size: req.file.size });
      fotoBase64 = bufferToBase64(req.file.buffer, req.file.mimetype);
    }
    
    const usuari = await Usuario.create({ 
      email, 
      password, 
      nombre: nombre || '', 
      foto: fotoBase64
    });
    
    console.log('✅ Usuario creado:', usuari._id);
    
    const token = jwt.sign({ id: usuari._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      usuari: { id: usuari._id, email: usuari.email, nombre: usuari.nombre, rol: usuari.rol, foto: usuari.foto }
    });
  } catch (err) {
    console.error('❌ Error en registro:', err.message, err);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuari = await Usuario.findOne({ email }).select('+password');
    if (!usuari || !(await usuari.comprovarPassword(password))) {
      return res.status(401).json({ error: 'Credencials incorrectes' });
    }
    const token = jwt.sign({ id: usuari._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      usuari: { id: usuari._id, email: usuari.email, nombre: usuari.nombre, rol: usuari.rol, foto: usuari.foto }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/perfil
router.get('/perfil', protegir, async (req, res) => {
  try {
    const usuari = req.usuari;
    res.json({ id: usuari._id, email: usuari.email, nombre: usuari.nombre, rol: usuari.rol, foto: usuari.foto, createdAt: usuari.createdAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/perfil
router.put('/perfil', protegir, upload.single('foto'), async (req, res) => {
  try {
    const usuari = req.usuari;
    const { email, password, nombre } = req.body;

    if (email && email !== usuari.email) {
      const existent = await Usuario.findOne({ email });
      if (existent) return res.status(400).json({ error: 'Aquest email ja està registrat' });
      usuari.email = email;
    }
    if (password) usuari.password = password;
    if (nombre !== undefined) usuari.nombre = nombre;
    if (req.file) {
      usuari.foto = bufferToBase64(req.file.buffer, req.file.mimetype);
    }

    await usuari.save();
    const token = jwt.sign({ id: usuari._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      usuari: { id: usuari._id, email: usuari.email, nombre: usuari.nombre, rol: usuari.rol, foto: usuari.foto }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Manejo de errores de Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Error al subir archivo: ${err.message}` });
  }
  if (err && err.message) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

export default router;
