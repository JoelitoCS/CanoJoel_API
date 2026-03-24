import mongoose from 'mongoose';
import Usuario from '../modelos/modeloUsuarios.js';

const esIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/usuaris — listar todos los usuarios (admin)
const getUsuaris = async (req, res) => {
  try {
    const usuaris = await Usuario.find().sort({ createdAt: -1 });
    res.json({ dades: usuaris, total: usuaris.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/usuaris/:id — obtener un usuario por id (admin)
const getUsuariById = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid' });
  }
  try {
    const usuari = await Usuario.findById(req.params.id);
    if (!usuari) return res.status(404).json({ error: 'Usuari no trobat' });
    res.json(usuari);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/usuaris/:id/rol — cambiar rol de usuario (solo admin)
const canviarRol = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid' });
  }
  try {
    const { rol } = req.body;
    const rols = ['usuari', 'editor', 'admin'];
    if (!rol || !rols.includes(rol)) {
      return res.status(400).json({ error: `Rol no vàlid. Valors permesos: ${rols.join(', ')}` });
    }
    const usuari = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true, runValidators: true }
    );
    if (!usuari) return res.status(404).json({ error: 'Usuari no trobat' });
    res.json({ id: usuari._id, email: usuari.email, nombre: usuari.nombre, rol: usuari.rol });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/usuaris/:id — eliminar usuario (solo admin)
const deleteUsuari = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid' });
  }
  try {
    const eliminat = await Usuario.findByIdAndDelete(req.params.id);
    if (!eliminat) return res.status(404).json({ error: 'Usuari no trobat' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getUsuaris, getUsuariById, canviarRol, deleteUsuari };
