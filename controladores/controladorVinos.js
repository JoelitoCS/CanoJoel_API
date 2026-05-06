import mongoose from 'mongoose';
import Vino from "../modelos/modeloVinos.js"

// Comprova si un id té format vàlid de MongoDB ObjectId
const esIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

// Centraliza la preparacion de datos cuando llega un formulario multipart.
// req.body contiene los campos de texto y req.file contiene la imagen subida por multer.
const prepararDatosVino = (req) => {
  const datos = { ...req.body };

  // Si el usuario ha elegido una foto, guardamos solo la ruta relativa en MongoDB.
  // Asi la API puede cambiar de dominio sin tener que modificar los documentos.
  if (req.file) {
    datos.imagen = `uploads/productos/${req.file.filename}`;
  }

  return datos;
};

const getVinos = async (req, res) => {
  try {
    const dades = await Vino.find().sort({ createdAt: -1 });
    res.json({ dades, total: dades.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVinoById = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid', id: req.params.id });
  }
  try {
    const vino = await Vino.findById(req.params.id);
    if (!vino) {
      return res.status(404).json({ error: 'Vino no trobat', id: req.params.id });
    }
    res.json(vino);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createVino = async (req, res) => {
  try {
    // Acepta JSON normal y tambien multipart/form-data con archivo "imatge".
    const nova = await Vino.create(prepararDatosVino(req));
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateVino = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid', id: req.params.id });
  }
  try {
    // Si llega una imagen nueva, sustituimos el campo imagen; si no, solo se cambian textos.
    const actualitzada = await Vino.findByIdAndUpdate(
      req.params.id,
      prepararDatosVino(req),
      { new: true, runValidators: true }
    );
    if (!actualitzada) {
      return res.status(404).json({ error: 'Vino no trobat', id: req.params.id });
    }
    res.json(actualitzada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteVino = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid', id: req.params.id });
  }
  try {
    const eliminada = await Vino.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      return res.status(404).json({ error: 'Vino no trobat', id: req.params.id });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateVinoWithImage = async (req, res) => {
  try {
    // Si no arriba fitxer (camp incorrecte, filtre rebutjat, etc.), retornem error de client
    if (!req.file) {
      return res.status(400).json({ error: 'Cap fitxer pujat' });
    }

    // IMPORTANT: desem només la ruta relativa, no la ruta absoluta del sistema operatiu
    // Amb això el client podrà construir la URL pública: /uploads/<filename>
    const pathImatge = 'uploads/productos/' + req.file.filename;

    // Actualitzem només el camp imatge del vino indicat per id
    const actualitzada = await Vino.findByIdAndUpdate(
      req.params.id,
      { imagen: pathImatge },
      { new: true }  // retornar el document amb el camp imatge ja actualitzat
    );
    if (!actualitzada) {
      return res.status(404).json({ error: 'Vino no trobat' });
    }
    res.json(actualitzada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getVinos, getVinoById, createVino, updateVino, deleteVino, updateVinoWithImage }
