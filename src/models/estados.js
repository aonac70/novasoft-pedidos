const ESTADOS = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  EN_PREPARACION: 'EN_PREPARACION',
  ENVIADO: 'ENVIADO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
});

// Ciclo de vida del pedido: estados a los que se puede pasar desde cada estado
const TRANSICIONES = Object.freeze({
  [ESTADOS.PENDIENTE]: [ESTADOS.EN_PREPARACION, ESTADOS.CANCELADO],
  [ESTADOS.EN_PREPARACION]: [ESTADOS.ENVIADO, ESTADOS.CANCELADO],
  [ESTADOS.ENVIADO]: [ESTADOS.ENTREGADO],
  [ESTADOS.ENTREGADO]: [],
  [ESTADOS.CANCELADO]: [],
});

const esEstadoValido = (estado) => Object.values(ESTADOS).includes(estado);

const puedeTransicionar = (actual, siguiente) => TRANSICIONES[actual]?.includes(siguiente) ?? false;

module.exports = { ESTADOS, TRANSICIONES, esEstadoValido, puedeTransicionar };
