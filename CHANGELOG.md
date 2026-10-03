# Registro de cambios

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

## [1.0.0] - 2026-10-03

Primera versión estable de NovaSoft Pedidos.

### Añadido

- Endpoint `PATCH /api/pedidos/:id/estado` para gestionar el ciclo de vida del pedido (`PENDIENTE`, `EN_PREPARACION`, `ENVIADO`, `ENTREGADO` y `CANCELADO`), con respuesta `409 Conflict` ante transiciones no permitidas (#3).
- Pipeline de integración continua con GitHub Actions: validación con ESLint, pruebas en Node.js 22 y 24, construcción del paquete y verificación de arranque (#2).
- Script `npm run build` que genera el paquete de distribución `dist/` con el archivo `build-info.json` (#2).
- Publicación automática del release y del paquete `.zip` al subir una etiqueta de versión (#2).

### Corregido

- El total del pedido ahora multiplica el precio unitario por la cantidad de cada producto; antes, los pedidos con cantidades mayores a uno se calculaban por debajo de su valor real (#1, #4).

## [0.1.0] - 2026-10-03

Línea base inicial del proyecto.

### Añadido

- API REST con Express para registrar, listar y consultar pedidos.
- Cálculo de subtotal, IVA (15 %) y total de cada pedido.
- Validación de los datos de entrada y manejo centralizado de errores.
- Pruebas unitarias y de integración con `node:test` y Supertest.
- Configuración de ESLint, EditorConfig y normalización de finales de línea.
- Políticas de ramas, commits y Pull Requests en `CONTRIBUTING.md`.
