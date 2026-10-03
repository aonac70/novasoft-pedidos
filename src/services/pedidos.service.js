const repositorio = require('../repositories/pedidos.repository');
const { validarPedido } = require('../validators/pedido.validator');
const { ESTADOS, esEstadoValido, puedeTransicionar } = require('../models/estados');
const { ErrorAplicacion, ErrorValidacion, ErrorNoEncontrado } = require('../utils/errores');
const { redondear } = require('../utils/numeros');
const { tasaIva } = require('../config');

/**
 * Calcula el subtotal, el IVA y el total de una lista de productos.
 * @param {{ cantidad: number, precioUnitario: number }[]} items
 */
function calcularTotales(items) {
  const subtotal = redondear(
    items.reduce((acumulado, { cantidad, precioUnitario }) => acumulado + cantidad * precioUnitario, 0),
  );
  const iva = redondear(subtotal * tasaIva);
  const total = redondear(subtotal + iva);
  return { subtotal, iva, total };
}

function crearPedido(datos) {
  const errores = validarPedido(datos);
  if (errores.length > 0) {
    throw new ErrorValidacion(errores);
  }

  const items = datos.items.map(({ producto, cantidad, precioUnitario }) => ({
    producto: producto.trim(),
    cantidad,
    precioUnitario,
  }));
  const ahora = new Date().toISOString();

  return repositorio.guardar({
    cliente: datos.cliente.trim(),
    items,
    ...calcularTotales(items),
    estado: ESTADOS.PENDIENTE,
    creadoEn: ahora,
    actualizadoEn: ahora,
  });
}

function listarPedidos(filtro = {}) {
  if (filtro.estado && !esEstadoValido(filtro.estado)) {
    throw new ErrorValidacion([`El estado "${filtro.estado}" no existe`]);
  }
  return repositorio.buscarTodos(filtro);
}

function obtenerPedido(id) {
  const pedido = repositorio.buscarPorId(Number(id));
  if (!pedido) {
    throw new ErrorNoEncontrado(`No existe un pedido con id ${id}`);
  }
  return pedido;
}

function cambiarEstado(id, nuevoEstado) {
  if (!esEstadoValido(nuevoEstado)) {
    throw new ErrorValidacion([`El estado "${nuevoEstado}" no existe`]);
  }

  const pedido = obtenerPedido(id);
  if (!puedeTransicionar(pedido.estado, nuevoEstado)) {
    throw new ErrorAplicacion(
      `No se puede cambiar un pedido de ${pedido.estado} a ${nuevoEstado}`,
      409,
    );
  }

  return repositorio.actualizar(pedido.id, {
    estado: nuevoEstado,
    actualizadoEn: new Date().toISOString(),
  });
}

module.exports = { calcularTotales, crearPedido, listarPedidos, obtenerPedido, cambiarEstado };
