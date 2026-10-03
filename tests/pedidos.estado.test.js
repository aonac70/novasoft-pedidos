const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/app');
const servicio = require('../src/services/pedidos.service');
const repositorio = require('../src/repositories/pedidos.repository');
const { ErrorAplicacion, ErrorValidacion } = require('../src/utils/errores');

const crearPedidoDePrueba = () =>
  servicio.crearPedido({
    cliente: 'Distribuidora Milagro',
    items: [{ producto: 'Cuaderno universitario', cantidad: 1, precioUnitario: 2.25 }],
  });

describe('Cambio de estado del pedido', () => {
  beforeEach(() => repositorio.limpiar());

  it('recorre el flujo completo PENDIENTE → EN_PREPARACION → ENVIADO → ENTREGADO', () => {
    const { id } = crearPedidoDePrueba();

    servicio.cambiarEstado(id, 'EN_PREPARACION');
    servicio.cambiarEstado(id, 'ENVIADO');
    const entregado = servicio.cambiarEstado(id, 'ENTREGADO');

    assert.equal(entregado.estado, 'ENTREGADO');
  });

  it('permite cancelar un pedido pendiente', () => {
    const { id } = crearPedidoDePrueba();
    assert.equal(servicio.cambiarEstado(id, 'CANCELADO').estado, 'CANCELADO');
  });

  it('impide saltarse estados del flujo', () => {
    const { id } = crearPedidoDePrueba();
    assert.throws(
      () => servicio.cambiarEstado(id, 'ENTREGADO'),
      (error) => error instanceof ErrorAplicacion && error.codigoEstado === 409,
    );
  });

  it('impide modificar un pedido cancelado', () => {
    const { id } = crearPedidoDePrueba();
    servicio.cambiarEstado(id, 'CANCELADO');
    assert.throws(() => servicio.cambiarEstado(id, 'EN_PREPARACION'), ErrorAplicacion);
  });

  it('rechaza estados inexistentes', () => {
    const { id } = crearPedidoDePrueba();
    assert.throws(() => servicio.cambiarEstado(id, 'PERDIDO'), ErrorValidacion);
  });

  describe('PATCH /api/pedidos/:id/estado', () => {
    it('actualiza el estado y devuelve el pedido', async () => {
      const { id } = crearPedidoDePrueba();
      const respuesta = await request(app)
        .patch(`/api/pedidos/${id}/estado`)
        .send({ estado: 'EN_PREPARACION' })
        .expect(200);

      assert.equal(respuesta.body.estado, 'EN_PREPARACION');
    });

    it('devuelve 409 ante una transición no permitida', async () => {
      const { id } = crearPedidoDePrueba();
      await request(app).patch(`/api/pedidos/${id}/estado`).send({ estado: 'ENVIADO' }).expect(409);
    });

    it('devuelve 400 si no se envía el estado', async () => {
      const { id } = crearPedidoDePrueba();
      await request(app).patch(`/api/pedidos/${id}/estado`).send({}).expect(400);
    });

    it('devuelve 404 si el pedido no existe', async () => {
      await request(app).patch('/api/pedidos/999/estado').send({ estado: 'ENVIADO' }).expect(404);
    });
  });
});
