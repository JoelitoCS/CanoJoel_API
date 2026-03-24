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
    }
})

const Cerveza = mongoose.model("Cerveza", cervezaSchema)
export default Cerveza