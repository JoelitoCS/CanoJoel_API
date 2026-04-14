import express from "express"
import { getCervezas, getCervezaById, createCerveza, updateCerveza, deleteCerveza } from "../controladores/controladorCervezas.js"
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';
import { updateCervezaWithImage } from '../controladores/controladorCervezas.js';


const router = express.Router()

// Rutas públicas
router.get("/", getCervezas)
router.get("/:id", getCervezaById)

// Rutas protegidas: solo editor o admin
router.post("/", protegir, autoritzar('editor', 'admin'), createCerveza)
router.put("/:id", protegir, autoritzar('editor', 'admin'), updateCerveza)
router.delete("/:id", protegir, autoritzar('editor', 'admin'), deleteCerveza)
// PATCH /:id/imatge — ordre: primer autoritzar('admin'), després multer (processa el fitxer), després controlador
// upload.single('imatge') espera un camp del formulari amb name="imatge"; el fitxer queda a req.file
// Flux:
// 1) autoritzar('admin') comprova permisos
// 2) upload.single('imatge') valida/desa el fitxer i omple req.file
// 3) updateCervezaWithImage desa la ruta al document Cerveza
router.patch('/:id/imatge', autoritzar('admin'), upload.single('imatge'), updateCervezaWithImage);

export default router
