import mongoose from 'mongoose';
import Cerveza from "../modelos/modeloCervezas.js"


// Comprova si un id té format vàlid de MongoDB ObjectId
const esIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

const getCervezas = async (req, res) => {
  try {
    const dades = await Cerveza.find().sort({ createdAt: -1 });
    res.json({ dades, total: dades.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCervezaById = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid', id: req.params.id });
  }
  try {
    const cerveza = await Cerveza.findById(req.params.id);
    if (!cerveza) {
      return res.status(404).json({ error: 'Cervesa no trobada', id: req.params.id });
    }
    res.json(cerveza);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCerveza = async (req, res) => {
  try {
    const nova = await Cerveza.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateCerveza = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid', id: req.params.id });
  }
  try {
    const actualitzada = await Cerveza.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualitzada) {
      return res.status(404).json({ error: 'Cervesa no trobada', id: req.params.id });
    }
    res.json(actualitzada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCerveza = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid', id: req.params.id });
  }
  try {
    const eliminada = await Cerveza.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      return res.status(404).json({ error: 'Cervesa no trobada', id: req.params.id });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCervezaWithImage = async (req, res) => {
  try {
    // Si no arriba fitxer (camp incorrecte, filtre rebutjat, etc.), retornem error de client
    if (!req.file) {
      return res.status(400).json({ error: 'Cap fitxer pujat' });
    }

    // IMPORTANT: desem només la ruta relativa, no la ruta absoluta del sistema operatiu
    // Amb això el client podrà construir la URL pública: /uploads/<filename>
    const pathImatge = 'uploads/' + req.file.filename;

    // Actualitzem només el camp imatge de la cervesa indicada per id
    const actualitzada = await Cerveza.findByIdAndUpdate(
      req.params.id,
      { imatge: pathImatge },
      { new: true }  // retornar el document amb el camp imatge ja actualitzat
    );
    if (!actualitzada) {
      return res.status(404).json({ error: 'Cervesa no trobada' });
    }
    res.json(actualitzada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getCervezas, getCervezaById, createCerveza, updateCerveza, deleteCerveza, updateCervezaWithImage };