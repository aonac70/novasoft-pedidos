class ErrorAplicacion extends Error {
  constructor(mensaje, codigoEstado = 500, detalles = []) {
    super(mensaje);
    this.name = 'ErrorAplicacion';
    this.codigoEstado = codigoEstado;
    this.detalles = detalles;
  }
}

class ErrorValidacion extends ErrorAplicacion {
  constructor(detalles) {
    super('Los datos enviados no son válidos', 400, detalles);
    this.name = 'ErrorValidacion';
  }
}

class ErrorNoEncontrado extends ErrorAplicacion {
  constructor(mensaje = 'Recurso no encontrado') {
    super(mensaje, 404);
    this.name = 'ErrorNoEncontrado';
  }
}

module.exports = { ErrorAplicacion, ErrorValidacion, ErrorNoEncontrado };
