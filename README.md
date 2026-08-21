# NebuLabs Studio J.D 3D

Sitio web estático, responsive y listo para publicar en **GitHub Pages**. Incluye catálogo dinámico, buscador, filtros, precios, medidas, productos destacados, modal de detalle, botones de cotización y una sección de personalización.

## Antes de publicar

Edita el archivo:

```text
assets/js/config.js
```

Reemplaza estos tres datos:

```js
whatsapp: "57XXXXXXXXXX",
instagram: "https://www.instagram.com/USUARIO/",
correo: "CORREO@EJEMPLO.COM",
```

El número de WhatsApp debe incluir el indicativo del país, sin `+`, espacios ni guiones. Ejemplo para Colombia:

```js
whatsapp: "573001234567",
```

Mientras esos datos sigan pendientes, la página muestra una franja de advertencia y los botones de contacto no se activan.

## Estructura del repositorio

```text
nebulabs-studio-jd-3d/
├── index.html
├── 404.html
├── .nojekyll
├── robots.txt
├── site.webmanifest
├── LEEME_PRIMERO.txt
├── PUBLICAR_EN_GITHUB_PAGES.md
├── ACTUALIZAR_CATALOGO.md
├── AVISO_DERECHOS_Y_FOTOS.md
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── config.js
    │   ├── catalogo.js
    │   └── app.js
    └── images/
        ├── marca/
        └── productos/
```

## Cómo probar el sitio antes de subirlo

1. Descomprime el archivo ZIP.
2. Abre la carpeta del proyecto.
3. Haz doble clic en `index.html`.
4. Revisa el catálogo, los filtros, el menú y los botones.

No requiere instalar programas ni ejecutar un servidor.

## Cómo publicar

Consulta la guía completa:

```text
PUBLICAR_EN_GITHUB_PAGES.md
```

El método recomendado para este proyecto es:

- Repositorio público.
- Rama `main`.
- Carpeta `/(root)`.
- Opción **Deploy from a branch**.

## Cómo actualizar productos

Consulta:

```text
ACTUALIZAR_CATALOGO.md
```

Los productos se administran desde:

```text
assets/js/catalogo.js
```

Los datos que aún no tienen precio o medidas se encuentran con el valor `null`; la página los presenta como **Por definir**.

## Compatibilidad

El sitio utiliza únicamente:

- HTML.
- CSS.
- JavaScript.
- Imágenes WebP y SVG.

No utiliza PHP, bases de datos ni servicios de servidor, por lo que es compatible con GitHub Pages.

## Importante antes de monetizar

Revisa `AVISO_DERECHOS_Y_FOTOS.md`. Para modelos inspirados en personajes, marcas o franquicias, valida la licencia comercial del archivo 3D y los derechos de uso de las fotografías antes de ofrecerlos públicamente.
