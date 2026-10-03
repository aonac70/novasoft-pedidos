const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/app');
const repositorio = require('../src/repositories/pedidos.repository');

const nuevoPedido = {
  cliente: 'Comercial Andrade',
  items: [{ producto: 'Resma de papel A4', cantidad: 1, precioUnitario: 4.5 }],
};

describe('API REST /api/pedidos', () => {
  beforeEach(() => repositorio.limpiar());

  it('GET /api/health responde que el servicio está operativo', async () => {
    const respuesta = await request(app).get('/api/health').expect(200);
    assert.equal(respuesta.body.estado, 'ok');
  });

  it('POST /api/pedidos crea un pedido y devuelve 201 con su ubicación', async () => {
    const respuesta = await request(app).post('/api/pedidos').send(nuevoPedido).expect(201);

    assert.equal(respuesta.headers.location, '/api/pedidos/1');
    assert.equal(respuesta.body.cliente, 'Comercial Andrade');
    assert.equal(respuesta.body.total, 5.18);
  });

  it('POST /api/pedidos devuelve 400 con el detalle de los errores de validación', async () => {
    const respuesta = await request(app).post('/api/pedidos').send({ cliente: '' }).expect(400);
    assert.ok(respuesta.body.detalles.length > 0);
  });

  it('POST /api/pedidos devuelve 400 si el JSON está mal formado', async () => {
    await request(app)
      .post('/api/pedidos')
      .set('Content-Type', 'application/json')
      .send('{"cliente": ')
      .expect(400);
  });

  it('GET /api/pedidos lista los pedidos registrados', async () => {
    await request(app).post('/api/pedidos').send(nuevoPedido);
    const respuesta = await request(app).get('/api/pedidos').expect(200);
    assert.equal(respuesta.body.total, 1);
  });

  it('GET /api/pedidos/:id devuelve 404 si el pedido no existe', async () => {
    await request(app).get('/api/pedidos/123').expect(404);
  });

  it('responde 404 en rutas inexistentes', async () => {
    await request(app).get('/api/inexistente').expect(404);
  });
});
