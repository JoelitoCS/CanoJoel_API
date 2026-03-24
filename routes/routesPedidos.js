import express from 'express';
import { createPedido, getMisPedidos, getPedidos, getPedidoById } from '../controladores/controladorPedidos.js';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todos los endpoints de pedidos requieren autenticación
router.post('/', protegir, createPedido);
router.get('/me', protegir, getMisPedidos);
router.get('/', protegir, autoritzar('admin'), getPedidos);
router.get('/:id', protegir, getPedidoById);

export default router;
