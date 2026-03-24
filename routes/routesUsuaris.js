import express from 'express';
import { getUsuaris, getUsuariById, canviarRol, deleteUsuari } from '../controladores/controladorUsuarios.js';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todos los endpoints requieren autenticación y rol admin
router.use(protegir, autoritzar('admin'));

router.get('/', getUsuaris);
router.get('/:id', getUsuariById);
router.patch('/:id/rol', canviarRol);
router.delete('/:id', deleteUsuari);

export default router;
