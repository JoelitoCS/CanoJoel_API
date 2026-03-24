import mongoose from 'mongoose';

const itemPedidoSchema = new mongoose.Schema({
  productoId: { type: String, required: true },
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ['cerveza', 'vino'], required: true },
  cantidad: { type: Number, required: true, min: 1 }
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  items: {
    type: [itemPedidoSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'El pedido debe tener al menos un producto'
    }
  },
  notas: {
    type: String,
    default: ''
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'cancelado'],
    default: 'pendiente'
  }
}, { timestamps: true });

const Pedido = mongoose.model('Pedido', pedidoSchema);
export default Pedido;
