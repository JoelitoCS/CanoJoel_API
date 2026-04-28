import express from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../modelos/modeloUsuarios.js';
import { protegir } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Función para validar Base64 de imagen
const validarFotoBase64 = (fotoBase64) => {
  if (!fotoBase64) return true; // opcional
  
  // Máximo 5MB en Base64 (aprox 6.7MB de string)
  if (fotoBase64.length > 6.7 * 1024 * 1024) {
    throw new Error('La imatge és massa gran (màxim 5MB)');
  }
  
  // Verificar que sea un data URL válido
  if (!fotoBase64.startsWith('data:image/')) {
    throw new Error('Format d\'imatge no vàlid. Usa data:image/*');
  }
  
  // Verificar MIME type permitido
  const mimeTypes = ['data:image/jpeg', 'data:image/png', 'data:image/webp', 'data:image/gif'];
  if (!mimeTypes.some(mime => fotoBase64.startsWith(mime))) {
    throw new Error('Tipus de fitxer no permès. Només jpeg, png, webp, gif');
  }
  
  return true;
};

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
  try {
    const { email, password, nombre, foto } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email i contrasenya requerits' });
    }
    const existent = await Usuario.findOne({ email });
    if (existent) {
      return res.status(400).json({ error: 'Aquest email ja està registrat' });
    }
    
    // Validar foto si se proporciona
    if (foto) {
      validarFotoBase64(foto);
    }
    
    const usuari = await Usuario.create({ 
      email, 
      password, 
      nombre: nombre || '', 
      foto: foto || '' 
    });
    const token = jwt.sign({ id: usuari._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      usuari: { id: usuari._id, email: usuari.email, nombre: usuari.nombre, rol: usuari.rol, foto: usuari.foto }
    });
  } catch (err) {
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
router.put('/perfil', protegir, async (req, res) => {
  try {
    const usuari = req.usuari;
    const { email, password, nombre, foto } = req.body;

    if (email && email !== usuari.email) {
      const existent = await Usuario.findOne({ email });
      if (existent) return res.status(400).json({ error: 'Aquest email ja està registrat' });
      usuari.email = email;
    }
    if (password) usuari.password = password;
    if (nombre !== undefined) usuari.nombre = nombre;
    if (foto) {
      validarFotoBase64(foto);
      usuari.foto = foto;
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

export default router;
