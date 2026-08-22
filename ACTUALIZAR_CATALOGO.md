# Cómo actualizar el catálogo de NebuLabs Studio J.D 3D

El catálogo actualizado contiene **86 referencias**: las referencias anteriores más **52 diseños nuevos**.

## Archivo principal

Los productos se administran desde:

```text
assets/js/catalogo.js
```

Cada producto tiene esta estructura:

```javascript
{
  "id": "nombre-unico",
  "nombre": "Nombre comercial",
  "categoria": "Soportes",
  "imagen": "assets/images/productos/nombre-unico.webp",
  "descripcion": "Descripción breve",
  "precioUnicolor": null,
  "precioMulticolor": null,
  "altoCm": 14,
  "largoCm": 18,
  "medidaEstimada": true,
  "destacado": false,
  "nuevo": true
}
```

## Reglas importantes

- Los precios se escriben como número: `18000`.
- Si el precio todavía no está definido, deja `null`; la página mostrará **Cotizar**.
- `medidaEstimada: true` muestra el símbolo `~` antes de la medida.
- Cuando confirmes una medida real, cambia el valor y usa `medidaEstimada: false`.
- Cada diseño se vende por unidad, salvo productos descritos expresamente como juego o set.
- Las imágenes deben estar en `assets/images/productos/` y preferiblemente en formato WebP.

## Cambiar una imagen

1. Conserva el mismo nombre de archivo.
2. Reemplázala dentro de `assets/images/productos/`.
3. Sube el archivo reemplazado a GitHub.
4. Espera la actualización de GitHub Pages y recarga con `Ctrl + F5`.
