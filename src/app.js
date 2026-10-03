const express = require('express');
const rutasPedidos = require('./routes/pedidos.routes');
const { ErrorAplicacion } = require('./utils/errores');
const { nombreServicio, version } = require('./config');

const app = express();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ estado: 'ok', servicio: nombreServicio, version });
});

app.use('/api/pedidos', rutasPedidos);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador centralizado de errores
app.use((err, _req, res, _next) => {
  if (err instanceof ErrorAplicacion) {
    return res.status(err.codigoEstado).json({ error: err.message, detalles: err.detalles });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
