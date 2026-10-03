const ESTADOS = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  EN_PREPARACION: 'EN_PREPARACION',
  ENVIADO: 'ENVIADO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
});

const esEstadoValido = (estado) => Object.values(ESTADOS).includes(estado);

module.exports = { ESTADOS, esEstadoValido };
