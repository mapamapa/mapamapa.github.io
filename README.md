# MAPA MAPA

Sitio web de **MAPA MAPA** — estudio de gestión y producción cultural con base en Chile.

Construido con [Astro 5](https://astro.build), desplegado en GitHub Pages en [mapamapa.cl](https://mapamapa.cl).

---

## Requisitos previos

| Herramienta | Versión mínima | Para qué se usa |
| ----------- | -------------- | ---------------- |
| [Node.js](https://nodejs.org) | v20 o superior | Runtime de JavaScript, incluye npm |
| [Git](https://git-scm.com) | cualquiera reciente | Control de versiones y clonado del repo |
| npm | v10+ (viene con Node) | Gestor de paquetes |

### Dependencias que se instalan automáticamente con `npm install`

| Paquete | Rol |
| ------- | --- |
| `astro` ^5 | Framework de sitio estático |
| `@astrojs/sitemap` ^3.7 | Generación automática de sitemap.xml |
| `sharp` ^0.34 | Optimización de imágenes a WebP (dev dependency) |

> **sharp** requiere compilación nativa. En la mayoría de los casos npm lo resuelve solo, pero si falla ver la sección [Solución de problemas](#solución-de-problemas).

---

## Instalación paso a paso

### Windows

1. **Instalar Node.js**
   - Descargar el instalador **LTS** (v20+) desde [nodejs.org](https://nodejs.org).
   - Ejecutar el `.msi`, dejar las opciones por defecto y marcar "Automatically install the necessary tools" si aparece.
   - Verificar en PowerShell o CMD:

     ```powershell
     node -v
     npm -v
     ```

2. **Instalar Git**
   - Descargar desde [git-scm.com](https://git-scm.com/download/win) y seguir el instalador.
   - Verificar:

     ```powershell
     git --version
     ```

3. **Clonar el repositorio**

   ```powershell
   git clone https://github.com/mapamapa/mapamapa.github.io.git
   cd mapamapa.github.io
   ```

4. **Instalar dependencias**

   ```powershell
   npm install
   ```

5. **Iniciar el servidor de desarrollo**

   ```powershell
   npm run dev
   ```

   Abrir **http://localhost:4321** en el navegador.

---

### macOS

1. **Instalar Node.js** (dos opciones)

   **Opción A — Instalador directo:**
   - Descargar el `.pkg` LTS (v20+) desde [nodejs.org](https://nodejs.org) e instalar.

   **Opción B — Con Homebrew (recomendado):**

   ```bash
   # Instalar Homebrew si no lo tienes
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Instalar Node.js
   brew install node@20
   ```

   Verificar:

   ```bash
   node -v
   npm -v
   ```

2. **Instalar Git**
   - macOS incluye Git con las Xcode Command Line Tools. Si no lo tienes:

     ```bash
     xcode-select --install
     ```

   - O con Homebrew: `brew install git`
   - Verificar:

     ```bash
     git --version
     ```

3. **Clonar el repositorio**

   ```bash
   git clone https://github.com/mapamapa/mapamapa.github.io.git
   cd mapamapa.github.io
   ```

4. **Instalar dependencias**

   ```bash
   npm install
   ```

5. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   Abrir **http://localhost:4321** en el navegador.

---

## Comandos disponibles

| Comando | Acción |
| ------- | ------ |
| `npm run dev` | Servidor de desarrollo con hot reload en `localhost:4321` |
| `npm run build` | Optimiza imágenes + genera el sitio estático en `dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm run optimize` | Solo optimiza imágenes (sin build) |

### Qué hace cada paso del build

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
│   └── optimize-images.mjs      # Script de optimización de imágenes
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

## Stack técnico

| Tecnología | Uso |
| ---------- | --- |
| **Astro 5** | Framework de sitio estático |
| **View Transitions** | Transiciones animadas entre páginas |
| **sharp** | Optimización automática de imágenes a WebP |
| **Instrument Sans** | Tipografía (Google Fonts, variable 400–700) |
| **CSS custom properties** | Design system con fluid typography |
| **@astrojs/sitemap** | Generación automática de sitemap |
| **GitHub Actions** | CI/CD automático |

---

## Solución de problemas

### `npm install` falla al compilar sharp

**sharp** necesita binarios nativos. Si falla:

```bash
# Limpiar caché y reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

En **Windows**, si el error menciona "node-gyp" o "Visual C++":
- Instalar [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) con la carga de trabajo "Desktop development with C++".
- O ejecutar en PowerShell como administrador:

  ```powershell
  npm install -g windows-build-tools
  ```

En **macOS**, si pide Xcode tools:

```bash
xcode-select --install
```

### El puerto 4321 está ocupado

```bash
# Usar otro puerto
npx astro dev --port 3000
```

### Las imágenes optimizadas no se generan

Verificar que la carpeta `public/img/` contiene imágenes y ejecutar manualmente:

```bash
npm run optimize
```

### Cambios en `site.json` no se reflejan

El servidor de desarrollo detecta cambios automáticamente. Si no se actualizan, detener el servidor (Ctrl+C) y volver a ejecutar `npm run dev`.
