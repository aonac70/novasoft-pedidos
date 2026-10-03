/**
 * Construye el paquete de distribución en la carpeta dist/.
 * Copia únicamente los archivos necesarios para ejecutar la aplicación en producción
 * y genera build-info.json para identificar qué versión y commit se empaquetaron.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const raiz = path.resolve(__dirname, '..');
const destino = path.join(raiz, 'dist');
const { name, version } = require('../package.json');

const ARCHIVOS = ['package.json', 'package-lock.json', 'README.md', 'CHANGELOG.md'];

function obtenerCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: raiz, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'desconocido';
  }
}

fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });
fs.cpSync(path.join(raiz, 'src'), path.join(destino, 'src'), { recursive: true });

for (const archivo of ARCHIVOS) {
  fs.copyFileSync(path.join(raiz, archivo), path.join(destino, archivo));
}

const informacion = {
  nombre: name,
  version,
  commit: obtenerCommit(),
  fecha: new Date().toISOString(),
  node: process.version,
};
fs.writeFileSync(path.join(destino, 'build-info.json'), `${JSON.stringify(informacion, null, 2)}\n`);

console.log(`Build completado: ${name}@${version} (commit ${informacion.commit}) -> dist/`);
