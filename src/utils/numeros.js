/**
 * Redondea un valor monetario a dos decimales evitando errores de coma flotante.
 * @param {number} valor
 * @returns {number}
 */
function redondear(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

module.exports = { redondear };
