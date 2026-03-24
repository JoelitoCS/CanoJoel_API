import express from "express"
import { getVinos, getVinoById, createVino, updateVino, deleteVino } from "../controladores/controladorVinos.js"
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';

const router = express.Router()

// Rutas públicas
router.get("/", getVinos)
router.get("/:id", getVinoById)

// Rutas protegidas: solo editor o admin
router.post("/", protegir, autoritzar('editor', 'admin'), createVino)
router.put("/:id", protegir, autoritzar('editor', 'admin'), updateVino)
router.delete("/:id", protegir, autoritzar('editor', 'admin'), deleteVino)

export default router
