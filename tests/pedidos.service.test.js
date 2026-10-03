const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const servicio = require('../src/services/pedidos.service');
const repositorio = require('../src/repositories/pedidos.repository');
const { ErrorValidacion, ErrorNoEncontrado } = require('../src/utils/errores');

const pedidoValido = () => ({
  cliente: 'Ferretería El Progreso',
  items: [
    { producto: 'Martillo', cantidad: 1, precioUnitario: 12.5 },
    { producto: 'Caja de clavos', cantidad: 1, precioUnitario: 3.75 },
  ],
});

describe('Servicio de pedidos', () => {
  beforeEach(() => repositorio.limpiar());

  describe('calcularTotales', () => {
    it('calcula subtotal, IVA (15 %) y total redondeados a dos decimales', () => {
      const totales = servicio.calcularTotales([
        { producto: 'Teclado', cantidad: 1, precioUnitario: 20 },
        { producto: 'Mouse', cantidad: 1, precioUnitario: 9.99 },
      ]);
      assert.deepEqual(totales, { subtotal: 29.99, iva: 4.5, total: 34.49 });
    });
  });

  describe('crearPedido', () => {
    it('registra el pedido con estado PENDIENTE e id autoincremental', () => {
      const primero = servicio.crearPedido(pedidoValido());
      const segundo = servicio.crearPedido(pedidoValido());

      assert.equal(primero.id, 1);
      assert.equal(segundo.id, 2);
      assert.equal(primero.estado, 'PENDIENTE');
      assert.equal(primero.total, 18.69);
    });

    it('rechaza un pedido sin cliente ni productos', () => {
      assert.throws(() => servicio.crearPedido({ items: [] }), ErrorValidacion);
    });

    it('rechaza cantidades no enteras o precios negativos', () => {
      const datos = pedidoValido();
      datos.items[0].cantidad = 1.5;
      datos.items[1].precioUnitario = -2;

      assert.throws(
        () => servicio.crearPedido(datos),
        (error) => error instanceof ErrorValidacion && error.detalles.length === 2,
      );
    });
  });

  describe('consultas', () => {
    it('obtiene un pedido existente por su id', () => {
      const creado = servicio.crearPedido(pedidoValido());
      assert.deepEqual(servicio.obtenerPedido(String(creado.id)), creado);
    });

    it('lanza ErrorNoEncontrado si el pedido no existe', () => {
      assert.throws(() => servicio.obtenerPedido(99), ErrorNoEncontrado);
    });

    it('filtra los pedidos por estado', () => {
      servicio.crearPedido(pedidoValido());
      assert.equal(servicio.listarPedidos({ estado: 'PENDIENTE' }).length, 1);
      assert.equal(servicio.listarPedidos({ estado: 'ENTREGADO' }).length, 0);
    });

    it('rechaza filtros con estados inexistentes', () => {
      assert.throws(() => servicio.listarPedidos({ estado: 'PERDIDO' }), ErrorValidacion);
    });
  });
});
