import mongoose from "mongoose";

const vinoSchema = new mongoose.Schema({
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

const Vino = mongoose.model("Vino", vinoSchema)
export default Vino