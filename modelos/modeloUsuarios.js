import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: [true, "L'email és obligatori"],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'La contrasenya és obligatòria'],
    minlength: 6,
    select: false
  },
  foto: {
    type: String,
    default: ''
  },
  rol: {
    type: String,
    enum: ['usuari', 'editor', 'admin'],
    default: 'usuari'
  }
}, { timestamps: true });

usuarioSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprovarPassword = async function(candidat) {
  return bcrypt.compare(candidat, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
