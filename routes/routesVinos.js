import express from "express"
import { getVinos, getVinoById, createVino, updateVino, deleteVino, updateVinoWithImage } from "../controladores/controladorVinos.js"
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router()

// Rutas públicas
router.get("/", getVinos)
router.get("/:id", getVinoById)

// Rutas protegidas: solo editor o admin
router.post("/", protegir, autoritzar('editor', 'admin'), createVino)
router.put("/:id", protegir, autoritzar('editor', 'admin'), updateVino)
router.delete("/:id", protegir, autoritzar('editor', 'admin'), deleteVino)
// PATCH /:id/imatge — ordem: primero autoritzar('admin'), después multer (procesa el fichero), después controlador
// upload.single('imatge') espera un campo del formulario con name="imatge"; el fichero queda a req.file
router.patch('/:id/imatge', protegir, autoritzar('editor', 'admin'), upload.single('imatge'), updateVinoWithImage);

export default router
