# MAPA MAPA

Sitio web de **MAPA MAPA** — estudio de gestión y producción cultural con base en Chile.

Construido con [Astro 5](https://astro.build), desplegado en GitHub Pages en [mapamapa.cl](https://mapamapa.cl).

---

## Levantar el proyecto en un computador nuevo

El proyecto incluye scripts que **detectan e instalan todo lo necesario** automáticamente. No requieren tener nada instalado previamente, salvo el sistema operativo.

### Windows

1. Descargar el proyecto como `.zip` desde GitHub y descomprimirlo (o clonarlo con `git clone` si ya tienes Git).
2. Abrir **PowerShell** dentro de la carpeta del proyecto.
3. Ejecutar:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

El script hace lo siguiente:

| Paso | Qué hace | Cómo lo hace |
| ---- | -------- | ------------ |
| 1 | Instala **Git** si no está | Usa `winget` (incluido en Windows 10/11) |
| 2 | Instala **Node.js v20+** si no está | Usa `winget install OpenJS.NodeJS.LTS` |
| 3 | Verifica que **npm** funcione | Viene incluido con Node.js |
| 4 | Instala las **dependencias del proyecto** | Ejecuta `npm install` (Astro, sharp, sitemap, gsap) |

> Si el script instala Git o Node por primera vez, puede pedir que cierres y reabras la terminal antes de continuar. Solo hay que volver a ejecutar `.\setup.ps1`.

### macOS

1. Abrir **Terminal**.
2. Si tienes Git: clonar el repo. Si no, descargar el `.zip` desde GitHub.

```bash
git clone https://github.com/mapamapa/mapamapa.github.io.git
cd mapamapa.github.io
bash setup.sh
```

El script hace lo siguiente:

| Paso | Qué hace | Cómo lo hace |
| ---- | -------- | ------------ |
| 1 | Instala **Homebrew** si no está | Descarga e instala desde brew.sh |
| 2 | Instala **Git** si no está | Usa `brew install git` o Xcode CLI Tools |
| 3 | Instala **Node.js v20+** si no está | Usa `brew install node@20` |
| 4 | Verifica que **npm** funcione | Viene incluido con Node.js |
| 5 | Instala las **dependencias del proyecto** | Ejecuta `npm install` (Astro, sharp, sitemap, gsap) |

### Linux

Mismo script que macOS:

```bash
bash setup.sh
```

En Linux usa **nvm** para instalar Node.js y el gestor de paquetes del sistema (`apt`, `dnf` o `pacman`) para Git.

---

## Después del setup

Una vez completado el script, el proyecto queda listo. Para iniciar:

```bash
npm run dev
```

El sitio queda disponible en **http://localhost:4321** con hot reload (se actualiza solo al guardar cambios).

---

## Qué se instala en el computador

### Herramientas del sistema (se instalan una sola vez)

| Herramienta | Versión | Para qué se usa |
| ----------- | ------- | ---------------- |
| [Git](https://git-scm.com) | cualquiera | Control de versiones, clonar y subir cambios |
| [Node.js](https://nodejs.org) | v20 o superior | Runtime de JavaScript, necesario para correr Astro |
| npm | v10+ (viene con Node) | Gestor de paquetes, instala las dependencias |

### Dependencias del proyecto (se instalan dentro de la carpeta con `npm install`)

| Paquete | Versión | Rol |
| ------- | ------- | --- |
| `astro` | ^5 | Framework que genera el sitio estático |
| `@astrojs/sitemap` | ^3.7 | Genera el sitemap.xml para SEO |
| `gsap` | ^3.12 | Animaciones de la interfaz |
| `sharp` | ^0.34 | Convierte imágenes a WebP optimizado (dev dependency) |

Estas dependencias se guardan en `node_modules/` y no se suben al repositorio. Si se borra esa carpeta, basta con ejecutar `npm install` de nuevo.

---

## Verificar el entorno

Si ya tienes Node instalado y quieres confirmar que todo está en orden sin reinstalar nada:

```bash
npm run setup
```

Muestra un diagnóstico rápido de Node, npm, Git y cada paquete del proyecto.

---

## Comandos disponibles

| Comando | Acción |
| ------- | ------ |
| `npm run dev` | Servidor de desarrollo con hot reload en `localhost:4321` |
| `npm run build` | Optimiza imágenes + genera el sitio estático en `dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm run optimize` | Solo optimiza imágenes (sin build) |
| `npm run setup` | Verifica que el entorno esté completo |

### Qué hace el build

1. `npm run optimize` — Ejecuta `scripts/optimize-images.mjs` que usa **sharp** para convertir las imágenes de `public/img/` a WebP optimizado en `public/img-opt/`.
2. `astro build` — Compila el sitio estático y lo deja en la carpeta `dist/`.

---

## Estructura del proyecto

```
mapamapa.github.io/
├── src/
│   ├── components/
│   │   ├── Nav.astro            # Navegación desktop + hamburguesa mobile
│   │   └── Footer.astro         # Footer: logo + menú
│   ├── layouts/
│   │   └── BaseLayout.astro     # Layout base (nav, footer, meta, View Transitions)
│   ├── pages/
│   │   ├── index.astro          # Home
│   │   ├── us.astro             # Quiénes somos
│   │   ├── work.astro           # Trabajos
│   │   ├── social.astro         # Redes sociales
│   │   ├── contact.astro        # Contacto
│   │   └── 404.astro            # Página de error
│   └── styles/
│       └── global.css           # Variables CSS, reset, animaciones, tipografía
├── public/
│   ├── data/
│   │   └── site.json            # ← Todos los contenidos editables del sitio
│   ├── img/                     # Imágenes originales
│   ├── img-opt/                 # Imágenes optimizadas (generadas por sharp)
│   ├── CNAME                    # Dominio mapamapa.cl
│   └── robots.txt               # SEO
├── scripts/
│   ├── optimize-images.mjs      # Optimización de imágenes con sharp
│   └── setup.mjs                # Verificación de entorno (npm run setup)
├── setup.sh                     # Setup automático para macOS/Linux
├── setup.ps1                    # Setup automático para Windows
├── .nvmrc                       # Versión de Node fijada para nvm
├── .github/workflows/
│   └── deploy.yml               # CI/CD con GitHub Actions
├── astro.config.mjs             # Configuración de Astro
└── package.json                 # Dependencias y scripts
```

---

## Editar contenido

Todo el contenido del sitio se gestiona desde **`public/data/site.json`**. No es necesario tocar código para cambiar textos, datos de contacto, redes sociales o proyectos.

| Sección | Qué contiene | Usado en |
| ------- | ------------ | -------- |
| `projects` | Lista de proyectos (nombre, descripción, url) | Home |
| `pye` | Producción & experiencias (título, imágenes) | Home |
| `about` | Textos de "quiénes somos" + capacidades | Us |
| `social` | Redes sociales (nombre, url, handle) | Social, Contact |
| `contact` | Email, teléfono, ubicación, horario | Contact |

### Ejemplo: agregar un proyecto

Abrir `public/data/site.json` y agregar un item al array `projects`:

```json
{ "id": "mi-proyecto", "name": "MI PROYECTO", "description": "Descripción corta", "url": "/work/mi-proyecto/" }
```

### Ejemplo: agregar un item a Producción & Experiencias

Agregar un item al array `pye.items` y su imagen en `public/img/pye/`:

```json
{ "title": "Nombre del Proyecto", "subtitle": "Detalle", "image": "/img/pye/nombre.jpg" }
```

---

## Deploy

El sitio se despliega automáticamente a GitHub Pages con cada push a `master` mediante GitHub Actions (`.github/workflows/deploy.yml`).

El flujo es: **push a `master`** → GitHub Actions instala Node 20, ejecuta `npm ci` y `npm run build` → publica `dist/` en la rama `gh-pages`.

El dominio `mapamapa.cl` está configurado via `public/CNAME`.

---

## Solución de problemas

### El script de setup no puede instalar Git o Node (Windows)

Si `winget` no está disponible (versiones antiguas de Windows 10), instalar manualmente:
- **Node.js**: descargar el instalador LTS desde [nodejs.org](https://nodejs.org)
- **Git**: descargar desde [git-scm.com](https://git-scm.com/download/win)

Después de instalar, cerrar y reabrir la terminal, y ejecutar `.\setup.ps1` de nuevo.

### `npm install` falla al compilar sharp

**sharp** necesita binarios nativos. Si falla:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

En **Windows**, si el error menciona "node-gyp" o "Visual C++":
- Instalar [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) con la carga de trabajo "Desktop development with C++".

En **macOS**, si pide Xcode tools:

```bash
xcode-select --install
```

### El puerto 4321 está ocupado

```bash
npx astro dev --port 3000
```

### Las imágenes optimizadas no se generan

Verificar que la carpeta `public/img/` contiene imágenes y ejecutar manualmente:

```bash
npm run optimize
```

### Cambios en `site.json` no se reflejan

Detener el servidor (Ctrl+C) y volver a ejecutar `npm run dev`.

### Permisos en PowerShell (Windows)

Si PowerShell bloquea el script con un error de "execution policy":

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```
