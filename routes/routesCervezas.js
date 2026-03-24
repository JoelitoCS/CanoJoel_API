import express from "express"
import { getCervezas, getCervezaById, createCerveza, updateCerveza, deleteCerveza } from "../controladores/controladorCervezas.js"
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';

const router = express.Router()

// Rutas públicas
router.get("/", getCervezas)
router.get("/:id", getCervezaById)

// Rutas protegidas: solo editor o admin
router.post("/", protegir, autoritzar('editor', 'admin'), createCerveza)
router.put("/:id", protegir, autoritzar('editor', 'admin'), updateCerveza)
router.delete("/:id", protegir, autoritzar('editor', 'admin'), deleteCerveza)

export default router
