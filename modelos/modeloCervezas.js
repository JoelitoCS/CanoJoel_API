import mongoose from "mongoose";

const cervezaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion:{
        type: String,
        required: true
    },
    graduacion: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        trim: true,
        // Guardem la ruta relativa per servir-la amb express.static
        // p. ex. "uploads/123456-nom.jpg" (NO cal desar la URL completa)
        // Això permet canviar domini/port sense tocar la base de dades
    }
})

const Cerveza = mongoose.model("Cerveza", cervezaSchema)
export default Cerveza