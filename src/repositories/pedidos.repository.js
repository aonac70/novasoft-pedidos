/**
 * Repositorio en memoria. Aísla el acceso a datos para que en el futuro
 * pueda reemplazarse por una base de datos sin modificar la lógica de negocio.
 */
const pedidos = new Map();
let siguienteId = 1;

function guardar(datos) {
  const pedido = { id: siguienteId++, ...datos };
  pedidos.set(pedido.id, pedido);
  return { ...pedido };
}

function buscarPorId(id) {
  const pedido = pedidos.get(id);
  return pedido ? { ...pedido } : null;
}

function buscarTodos(filtro = {}) {
  return [...pedidos.values()]
    .filter((pedido) => !filtro.estado || pedido.estado === filtro.estado)
    .map((pedido) => ({ ...pedido }));
}

function actualizar(id, cambios) {
  const existente = pedidos.get(id);
  if (!existente) {
    return null;
  }
  const actualizado = { ...existente, ...cambios, id };
  pedidos.set(id, actualizado);
  return { ...actualizado };
}

function limpiar() {
  pedidos.clear();
  siguienteId = 1;
}

module.exports = { guardar, buscarPorId, buscarTodos, actualizar, limpiar };
