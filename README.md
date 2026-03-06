# MAPA MAPA

Sitio web de **MAPA MAPA** — estudio de gestión y producción cultural con base en Chile.

Construido con [Astro 5](https://astro.build), desplegado en GitHub Pages en [mapamapa.cl](https://mapamapa.cl).

---

## Requisitos

- [Node.js](https://nodejs.org) v20 o superior
- npm (incluido con Node.js)

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El sitio queda disponible en **http://localhost:4321**

## Comandos

| Comando           | Acción                                      |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con hot reload       |
| `npm run build`   | Genera el sitio estático en `dist/`         |
| `npm run preview` | Previsualiza el build localmente            |

## Estructura del proyecto

```
src/
├── components/
│   ├── Nav.astro            # Navegación desktop + hamburguesa mobile
│   └── Footer.astro         # Footer: logo + menú (misma navegación que Nav)
├── layouts/
│   └── BaseLayout.astro     # Layout base (nav, footer, meta, View Transitions)
├── pages/
│   ├── index.astro          # Home: servicios, logo, collage, proyectos, PYE (hover lila)
│   ├── us.astro             # Quiénes somos + capacidades
│   ├── social.astro         # Redes sociales
│   ├── contact.astro        # Contacto
│   └── 404.astro            # Página de error
├── styles/
│   └── global.css           # Variables CSS, reset, animaciones, tipografía
public/
├── data/
│   └── site.json            # ← Todos los contenidos editables del sitio
├── img/
│   ├── logo.png             # Logo principal
│   ├── red.jpg, box.jpg,    # Imágenes del home
│   │   proy.jpg, bw.jpg
│   └── pye/                 # Imágenes de Producción & Experiencias
├── CNAME                    # Dominio mapamapa.cl
└── robots.txt               # SEO
```

## Editar contenido

Todo el contenido del sitio se gestiona desde un solo archivo: **`public/data/site.json`**

No es necesario tocar código para cambiar textos, datos de contacto, redes sociales o proyectos.

### Secciones del JSON

| Sección      | Qué contiene                                  | Usado en           |
| ------------ | --------------------------------------------- | ------------------- |
| `projects`   | Lista de proyectos (nombre, descripción, url) | Home                |
| `pye`        | Producción & experiencias (título, imágenes)  | Home                |
| `about`      | Textos de "quiénes somos" + capacidades       | Us                  |
| `social`     | Redes sociales (nombre, url, handle)         | Social, Contact     |
| `contact`    | Email, teléfono, ubicación, horario            | Contact             |

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

## Deploy

El sitio se despliega automáticamente a GitHub Pages con cada push a `main` mediante GitHub Actions (`.github/workflows/deploy.yml`).

El dominio `mapamapa.cl` está configurado via `public/CNAME`.

## Stack

- **Astro 5** — framework estático
- **View Transitions** — transiciones animadas entre páginas
- **Instrument Sans** — tipografía (Google Fonts, variable 400–700)
- **CSS custom properties** — design system con fluid typography
- **Contenido centralizado** — `site.json` como CMS simple
- **GitHub Actions** — CI/CD automático
- **@astrojs/sitemap** — generación automática de sitemap

## Detalles de UX

- **PYE (Producción & experiencias)**: hover con fondo lila y texto negro, transición 0.4s
- **Footer**: logo pequeño a la izquierda, menú de navegación a la derecha (alineado con el nav superior)

## Regla UI Persistente

- Todos los textos del sitio deben mostrarse en mayúsculas, sin excepciones.
- No deben agregarse reglas que rompan esa norma, como `text-transform: none`, `lowercase` o `capitalize`.
- Inputs, botones, labels, párrafos, títulos, enlaces y mensajes del sistema también deben respetar esta convención.
- En este sitio, las imágenes nunca deben agrandarse en `hover`.
- Cualquier interacción sobre imágenes debe mantener su tamaño original y puede resolverse con recursos como color, opacidad, borde, máscara o movimiento del contenedor, pero sin aplicar `transform: scale(...)` sobre la imagen.
- Este sitio no usa ni usará textos tipo `eyebrow`, `overline` o `kicker` sobre los títulos.
- Los encabezados deben resolverse de forma directa, sin una línea introductoria pequeña encima del `h1` o `h2`.
