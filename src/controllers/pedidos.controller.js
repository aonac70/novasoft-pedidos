const servicio = require('../services/pedidos.service');

function listar(req, res) {
  const pedidos = servicio.listarPedidos({ estado: req.query.estado });
  res.json({ total: pedidos.length, datos: pedidos });
}

function obtener(req, res) {
  res.json(servicio.obtenerPedido(req.params.id));
}

function crear(req, res) {
  const pedido = servicio.crearPedido(req.body);
  res.status(201).location(`/api/pedidos/${pedido.id}`).json(pedido);
}

function cambiarEstado(req, res) {
  res.json(servicio.cambiarEstado(req.params.id, req.body?.estado));
}

module.exports = { listar, obtener, crear, cambiarEstado };
