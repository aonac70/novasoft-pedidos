const { version, name } = require('../../package.json');

module.exports = {
  nombreServicio: name,
  version,
  puerto: Number(process.env.PORT) || 3000,
  // Tarifa vigente del IVA en Ecuador
  tasaIva: 0.15,
};
