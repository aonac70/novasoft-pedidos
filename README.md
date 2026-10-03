# NovaSoft Pedidos

API REST para la gestión de pedidos de la empresa **NovaSoft**, desarrollada como proyecto práctico de la asignatura *Gestión de la Configuración de Software* de la Universidad Estatal de Milagro (UNEMI).

El repositorio aplica prácticas de gestión de la configuración: control de versiones con Git, modelo de ramas, Conventional Commits, revisión mediante Pull Requests, integración continua con GitHub Actions y entregas versionadas.

## Tecnologías

- **Node.js 22+** y **Express 5**: servidor HTTP y API REST.
- **node:test** y **Supertest**: pruebas unitarias y de integración.
- **ESLint**: validación de sintaxis y estilo del código.
- **GitHub Actions**: integración continua y publicación de releases.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior
- Git

## Instalación y ejecución

```bash
git clone https://github.com/aonac70/novasoft-pedidos.git
cd novasoft-pedidos
npm ci
npm start
```

La API queda disponible en `http://localhost:3000`. El puerto puede cambiarse con la variable de entorno `PORT`.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor en modo producción. |
| `npm run dev` | Inicia el servidor y lo reinicia al detectar cambios. |
| `npm run lint` | Valida la sintaxis y el estilo del código con ESLint. |
| `npm test` | Ejecuta las pruebas unitarias y de integración. |

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/health` | Estado del servicio y versión desplegada. |
| `GET` | `/api/pedidos` | Lista los pedidos. Admite el filtro `?estado=PENDIENTE`. |
| `GET` | `/api/pedidos/:id` | Obtiene un pedido por su identificador. |
| `POST` | `/api/pedidos` | Registra un pedido nuevo y calcula subtotal, IVA (15 %) y total. |

### Ejemplo: registrar un pedido

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
        "cliente": "Ferretería El Progreso",
        "items": [
          { "producto": "Martillo", "cantidad": 2, "precioUnitario": 12.50 },
          { "producto": "Caja de clavos", "cantidad": 1, "precioUnitario": 3.75 }
        ]
      }'
```

## Estructura del proyecto

```text
src/
├── app.js            # Configuración de Express y manejo de errores
├── server.js         # Punto de entrada del servidor
├── config/           # Parámetros de configuración
├── controllers/      # Capa HTTP
├── models/           # Estados del pedido
├── repositories/     # Acceso a datos (en memoria)
├── routes/           # Definición de rutas
├── services/         # Lógica de negocio
├── utils/            # Utilidades y errores
└── validators/       # Validación de datos de entrada
tests/                # Pruebas automatizadas
```

## Flujo de trabajo

Las políticas de ramas, commits, Pull Requests y versionado están descritas en [CONTRIBUTING.md](CONTRIBUTING.md). El historial de versiones se mantiene en [CHANGELOG.md](CHANGELOG.md).

## Licencia

Distribuido bajo la licencia MIT con fines académicos.
