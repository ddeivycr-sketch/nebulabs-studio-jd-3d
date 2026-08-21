# Actualizar el catálogo

La información del catálogo está en:

```text
assets/js/catalogo.js
```

## Cambiar el precio de un producto

Busca el producto por su nombre. Ejemplo:

```js
{
  id: "esqueleto-trex",
  nombre: "Esqueleto T-Rex articulado",
  precioUnicolor: 18000,
  precioMulticolor: 21000,
  altoCm: 13,
  largoCm: 24
}
```

Los precios se escriben como números, sin puntos, comas ni signo `$`:

```js
precioUnicolor: 18000,
```

La página lo mostrará como precio en pesos colombianos.

## Completar datos pendientes

Cuando un dato aparece así:

```js
precioUnicolor: null,
altoCm: null,
```

Cambia `null` por el valor real:

```js
precioUnicolor: 22000,
altoCm: 18,
```

## Cambiar una imagen

1. Prepara la nueva fotografía en formato `.webp`, `.jpg` o `.png`.
2. Usa un nombre sin espacios ni tildes. Ejemplo:

```text
robot-nuevo.webp
```

3. Copia la imagen en:

```text
assets/images/productos/
```

4. En `catalogo.js`, actualiza la ruta:

```js
imagen: "assets/images/productos/robot-nuevo.webp",
```

## Agregar un producto nuevo

Copia uno de los bloques y pégalo antes del cierre final `];`.

```js
{
  id: "nombre-unico-del-producto",
  nombre: "Nombre comercial del producto",
  categoria: "Novedades",
  imagen: "assets/images/productos/nombre-imagen.webp",
  descripcion: "Descripción corta y comercial del diseño.",
  precioUnicolor: null,
  precioMulticolor: null,
  altoCm: null,
  largoCm: null,
  destacado: false,
  nuevo: true
},
```

Reglas importantes:

- Cada `id` debe ser único.
- Usa comas entre productos.
- No elimines el cierre `];`.
- `destacado: true` hace que el producto aparezca primero.
- `nuevo: true` agrega la etiqueta **Nuevo**.

## Crear una categoría nueva

Solo escribe el nuevo nombre en el producto:

```js
categoria: "Hogar",
```

El filtro se crea automáticamente en la página.

## Publicar la actualización

Después de guardar los cambios:

1. Abre el repositorio en GitHub.
2. Carga los archivos modificados.
3. Haz clic en **Commit changes**.
4. Espera unos minutos para ver la actualización en GitHub Pages.
