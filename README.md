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
├── components/         # Componentes reutilizables (.astro)
│   ├── Nav.astro       # Navegación con menú hamburguesa full-screen
│   ├── Hero.astro      # Hero animado del home
│   ├── ServiceMarquee  # Marquee infinito de servicios
│   ├── ProjectCard     # Tarjeta de proyecto con hover effects
│   ├── ProjectGrid     # Grid del portafolio
│   └── Footer.astro    # Footer global
├── content/
│   └── work/           # Proyectos del portafolio (Markdown)
├── layouts/
│   └── BaseLayout.astro # Layout base (nav, footer, meta, View Transitions)
├── pages/              # Rutas del sitio
│   ├── index.astro     # Home
│   ├── us.astro        # Quiénes somos
│   ├── work/           # Portafolio (listado + detalle)
│   ├── social.astro    # Redes sociales
│   ├── contact.astro   # Contacto
│   └── 404.astro       # Página de error
├── styles/
│   └── global.css      # Variables CSS, reset, animaciones
└── content.config.ts   # Schema de content collections
```

## Agregar un proyecto al portafolio

Crea un archivo `.md` en `src/content/work/` con este formato:

```markdown
---
title: "Nombre del Proyecto"
description: "Descripción breve del proyecto."
date: 2025-06-15
tags: ["museografía", "producción"]
cover: "/images/work/mi-proyecto-cover.jpg"
gallery:
  - "/images/work/mi-proyecto-1.jpg"
  - "/images/work/mi-proyecto-2.jpg"
featured: true
client: "Nombre del cliente"
location: "Santiago, Chile"
---

Texto extendido del proyecto en Markdown...
```

Las imágenes van en `public/images/work/`. El proyecto aparece automáticamente en `/work/` y genera su página de detalle en `/work/nombre-del-archivo/`.

## Deploy

El sitio se despliega automáticamente a GitHub Pages con cada push a `main` mediante GitHub Actions (`.github/workflows/deploy.yml`).

El dominio `mapamapa.cl` está configurado via el archivo `public/CNAME`.

## Stack

- **Astro 5** — framework estático
- **View Transitions** — transiciones animadas entre páginas
- **Content Collections** — portafolio gestionado con Markdown
- **CSS custom properties** — design system con fluid typography
- **GitHub Actions** — CI/CD automático
