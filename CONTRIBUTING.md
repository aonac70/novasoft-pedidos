# Guía de contribución

Este documento define las políticas de gestión de la configuración que sigue el equipo en el repositorio **novasoft-pedidos**. Todo cambio al código debe respetarlas.

## 1. Modelo de ramas (GitFlow simplificado)

| Rama | Propósito | Se crea desde | Se integra en |
| --- | --- | --- | --- |
| `main` | Código estable, listo para producción. Cada versión se marca con una etiqueta `vX.Y.Z`. | — | — |
| `develop` | Integración de los cambios aprobados para la próxima versión. | `main` | `main` (mediante `release/*`) |
| `feature/<descripcion>` | Desarrollo de una funcionalidad nueva. | `develop` | `develop` |
| `bugfix/<descripcion>` | Corrección de un error detectado en `develop`. | `develop` | `develop` |
| `release/<X.Y.Z>` | Preparación de una entrega: versión, changelog y ajustes finales. | `develop` | `main` y `develop` |
| `hotfix/<descripcion>` | Corrección urgente sobre producción. | `main` | `main` y `develop` |

Reglas:

- Los nombres de rama se escriben en minúsculas y con guiones: `feature/estado-pedidos`, `bugfix/calculo-total`, `release/1.0.0`.
- **No se hacen commits directos** en `main` ni en `develop`; todo cambio entra mediante un Pull Request.
- Cada rama atiende un único cambio y se elimina después de ser integrada.

## 2. Mensajes de commit (Conventional Commits)

Formato:

```text
<tipo>(<ámbito opcional>): <descripción breve en minúsculas y en tiempo presente>

[cuerpo opcional: qué cambia y por qué]

[pie opcional: referencias a issues, p. ej. Closes #1]
```

| Tipo | Uso |
| --- | --- |
| `feat` | Nueva funcionalidad. |
| `fix` | Corrección de un error. |
| `docs` | Cambios en la documentación. |
| `test` | Creación o modificación de pruebas. |
| `refactor` | Cambio de código que no altera el comportamiento. |
| `build` | Cambios en el sistema de construcción o dependencias. |
| `ci` | Cambios en la configuración de integración continua. |
| `chore` | Tareas de mantenimiento. |

Ejemplos:

```text
feat: agrega endpoint para actualizar el estado del pedido
fix: considera la cantidad de cada producto en el cálculo del total
ci: agrega pipeline de integración continua con GitHub Actions
```

## 3. Pull Requests

1. Todo cambio comienza con un **issue** que describe el error o la solicitud.
2. Se crea la rama correspondiente desde `develop` y se suben los commits.
3. Se abre un Pull Request hacia `develop` usando la plantilla del repositorio y se enlaza el issue.
4. El Pull Request requiere **al menos una aprobación** de otro integrante y que el **pipeline de CI termine en verde**.
5. Una vez aprobado, se integra con *merge commit* y se elimina la rama.

## 4. Versionado y entregas

El proyecto sigue [Versionado Semántico](https://semver.org/lang/es/) `MAYOR.MENOR.PARCHE`:

- **MAYOR**: cambios incompatibles con versiones anteriores.
- **MENOR**: nuevas funcionalidades compatibles.
- **PARCHE**: correcciones de errores compatibles.

Proceso de entrega:

1. Crear `release/X.Y.Z` desde `develop`.
2. Actualizar la versión en `package.json` (`npm version X.Y.Z --no-git-tag-version`) y documentar los cambios en `CHANGELOG.md`.
3. Abrir un Pull Request de `release/X.Y.Z` hacia `main` y, una vez aprobado, integrarlo.
4. Crear la etiqueta anotada `vX.Y.Z` sobre `main` y subirla al repositorio remoto.
5. Integrar `main` de vuelta en `develop` para mantener ambas ramas sincronizadas.

## 5. Antes de subir cambios

```bash
npm run lint
npm test
```

Ambos comandos deben terminar sin errores; son los mismos que ejecuta el pipeline de integración continua.
