import mongoose from 'mongoose';
import Pedido from '../modelos/modeloPedidos.js';
import nodemailer from 'nodemailer';

const esIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

// Configuración del transporter de email
const crearTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
};

const enviarEmailPedido = async (pedido, usuari) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('[MAIL] Variables MAIL_USER/MAIL_PASS no configurades. Correu no enviat.');
    return;
  }
  try {
    const transporter = crearTransporter();
    const itemsHtml = pedido.items.map(i =>
      `<li><strong>${i.nombre}</strong> (${i.tipo}) — Cantidad: ${i.cantidad}</li>`
    ).join('');

    await transporter.sendMail({
      from: `"Vinacoteca" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_PROPIETARI || process.env.MAIL_USER,
      subject: `Nou pedido de ${usuari.nombre || usuari.email}`,
      html: `
        <h2>Nou pedido a Vinacoteca</h2>
        <p><strong>Client:</strong> ${usuari.nombre || ''} (${usuari.email})</p>
        <p><strong>Notes:</strong> ${pedido.notas || 'Cap'}</p>
        <h3>Productes demanats:</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>Data:</strong> ${new Date().toLocaleString('es-ES')}</p>
      `
    });
    console.log('[MAIL] Correu de pedido enviat correctament.');
  } catch (err) {
    console.error('[MAIL] Error enviant correu:', err.message);
  }
};

// POST /api/pedidos — crear pedido (usuario autenticado)
const createPedido = async (req, res) => {
  try {
    const { items, notas } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido ha de tenir almenys un producte' });
    }
    const pedido = await Pedido.create({ usuario: req.usuari._id, items, notas: notas || '' });
    await pedido.populate('usuario', 'email nombre');

    // Enviar email al propietario (asíncrono, no bloquea respuesta)
    enviarEmailPedido(pedido, req.usuari).catch(() => {});

    res.status(201).json(pedido);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/pedidos/me — pedidos del usuario autenticado
const getMisPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuari._id }).sort({ createdAt: -1 });
    res.json({ dades: pedidos, total: pedidos.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/pedidos — todos los pedidos (solo admin)
const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('usuario', 'email nombre').sort({ createdAt: -1 });
    res.json({ dades: pedidos, total: pedidos.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/pedidos/:id
const getPedidoById = async (req, res) => {
  if (!esIdValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invàlid' });
  }
  try {
    const pedido = await Pedido.findById(req.params.id).populate('usuario', 'email nombre');
    if (!pedido) return res.status(404).json({ error: 'Pedido no trobat' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createPedido, getMisPedidos, getPedidos, getPedidoById };
