import express from "express"
import { getCervezas, getCervezaById, createCerveza, updateCerveza, deleteCerveza, updateCervezaWithImage } from "../controladores/controladorCervezas.js"
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';


const router = express.Router()

// Rutas públicas
router.get("/", getCervezas)
router.get("/:id", getCervezaById)

// Rutas protegidas: solo editor o admin
// upload.single('imatge') permite que crear/editar reciban una foto junto a los campos de texto.
// Si la peticion viene en JSON y no trae archivo, multer la deja pasar sin romper nada.
router.post("/", protegir, autoritzar('editor', 'admin'), upload.single('imatge'), createCerveza)
router.put("/:id", protegir, autoritzar('editor', 'admin'), upload.single('imatge'), updateCerveza)
router.delete("/:id", protegir, autoritzar('editor', 'admin'), deleteCerveza)
// PATCH /:id/imatge — ordre: primer autoritzar('admin'), després multer (processa el fitxer), després controlador
// upload.single('imatge') espera un camp del formulari amb name="imatge"; el fitxer queda a req.file
// Flux:
// 1) autoritzar('admin') comprova permisos
// 2) upload.single('imatge') valida/desa el fitxer i omple req.file
// 3) updateCervezaWithImage desa la ruta al document Cerveza
router.patch('/:id/imatge', protegir, autoritzar('editor', 'admin'), upload.single('imatge'), updateCervezaWithImage);

export default router
