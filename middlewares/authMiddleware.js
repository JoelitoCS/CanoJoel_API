import jwt from 'jsonwebtoken';
import Usuario from '../modelos/modeloUsuarios.js';

// Verifica token JWT y carga el usuario en req.usuari
const protegir = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ error: 'No autoritzat: token absent' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuari = await Usuario.findById(decoded.id);
    if (!req.usuari) {
      return res.status(401).json({ error: 'Usuari no vàlid' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token no vàlid o expirat' });
  }
};

// Middleware de roles: solo permite acceso a los roles indicados
const autoritzar = (...rols) => {
  return (req, res, next) => {
    if (!rols.includes(req.usuari.rol)) {
      return res.status(403).json({ error: `Accés denegat: rol '${req.usuari.rol}' no autoritzat` });
    }
    next();
  };
};

export { protegir, autoritzar };
