import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const REQUIRED_NODE = 20;

const cyan    = t => `\x1b[36m${t}\x1b[0m`;
const green   = t => `\x1b[32m${t}\x1b[0m`;
const red     = t => `\x1b[31m${t}\x1b[0m`;
const yellow  = t => `\x1b[33m${t}\x1b[0m`;

let errors = 0;

console.log(`\n${cyan('═══════════════════════════════════════')}`);
console.log(`${cyan('  MAPA MAPA — Verificación de entorno')}`);
console.log(`${cyan('═══════════════════════════════════════')}\n`);

const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
if (nodeMajor >= REQUIRED_NODE) {
  console.log(green(`  ✔ Node.js v${process.versions.node}`));
} else {
  console.log(red(`  ✖ Node.js v${process.versions.node} — se requiere v${REQUIRED_NODE}+`));
  errors++;
}

try {
  const npmVer = execSync('npm -v', { encoding: 'utf8' }).trim();
  console.log(green(`  ✔ npm v${npmVer}`));
} catch {
  console.log(red('  ✖ npm no encontrado'));
  errors++;
}

try {
  const gitVer = execSync('git --version', { encoding: 'utf8' }).trim().replace('git version ', '');
  console.log(green(`  ✔ Git ${gitVer}`));
} catch {
  console.log(yellow('  ⚠ Git no encontrado (opcional para desarrollo local)'));
}

const nodeModules = join(ROOT, 'node_modules');
if (existsSync(nodeModules)) {
  console.log(green('  ✔ node_modules existe'));
} else {
  console.log(yellow('  ⚠ node_modules no existe — ejecuta npm install'));
  errors++;
}

const pkgs = ['astro', 'sharp', '@astrojs/sitemap'];
for (const pkg of pkgs) {
  const pkgPath = join(nodeModules, pkg);
  if (existsSync(pkgPath)) {
    console.log(green(`  ✔ ${pkg}`));
  } else {
    console.log(red(`  ✖ ${pkg} no instalado`));
    errors++;
  }
}

console.log('');
if (errors === 0) {
  console.log(green('═══════════════════════════════════════'));
  console.log(green('  ¡Todo listo! Ejecuta: npm run dev'));
  console.log(green('═══════════════════════════════════════\n'));
} else {
  console.log(red('═══════════════════════════════════════'));
  console.log(red(`  ${errors} problema(s) encontrado(s).`));
  console.log(red('  Ejecuta el script de setup para tu OS:'));
  console.log(red('  macOS/Linux:  bash setup.sh'));
  console.log(red('  Windows:      .\\setup.ps1'));
  console.log(red('═══════════════════════════════════════\n'));
  process.exit(1);
}
