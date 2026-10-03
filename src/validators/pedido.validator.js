const esTextoNoVacio = (valor) => typeof valor === 'string' && valor.trim().length > 0;

/**
 * Valida la estructura de un pedido nuevo.
 * @param {object} datos
 * @returns {string[]} lista de errores encontrados (vacía si es válido)
 */
function validarPedido(datos) {
  const errores = [];

  if (!datos || typeof datos !== 'object') {
    return ['El cuerpo de la petición debe ser un objeto JSON'];
  }

  if (!esTextoNoVacio(datos.cliente)) {
    errores.push('El campo "cliente" es obligatorio');
  }

  if (!Array.isArray(datos.items) || datos.items.length === 0) {
    errores.push('El pedido debe contener al menos un producto en "items"');
    return errores;
  }

  datos.items.forEach((item, indice) => {
    const posicion = `items[${indice}]`;
    if (!esTextoNoVacio(item?.producto)) {
      errores.push(`${posicion}.producto es obligatorio`);
    }
    if (!Number.isInteger(item?.cantidad) || item.cantidad <= 0) {
      errores.push(`${posicion}.cantidad debe ser un número entero mayor que cero`);
    }
    if (typeof item?.precioUnitario !== 'number' || !(item.precioUnitario > 0)) {
      errores.push(`${posicion}.precioUnitario debe ser un número mayor que cero`);
    }
  });

  return errores;
}

module.exports = { validarPedido };
