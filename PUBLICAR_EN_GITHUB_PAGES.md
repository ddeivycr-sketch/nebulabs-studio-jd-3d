# Publicar NebuLabs Studio J.D 3D en GitHub Pages

## ¿GitHub Pages es gratis?

Sí. GitHub Pages se puede utilizar con un repositorio **público** dentro del plan GitHub Free. Este proyecto es un sitio estático en HTML, CSS y JavaScript, por lo que puede publicarse directamente sin contratar hosting.

> En el plan gratuito, el repositorio debe mantenerse público para usar GitHub Pages.

---

## Parte 1. Preparar los archivos

### Paso 1. Descomprimir el paquete

1. Descarga el archivo ZIP del proyecto.
2. Haz clic derecho sobre el ZIP.
3. Selecciona **Extraer todo**.
4. Abre la carpeta `nebulabs-studio-jd-3d`.

### Paso 2. Configurar tus datos de contacto

Abre el archivo:

```text
assets/js/config.js
```

Puedes abrirlo con Bloc de notas, Notepad++, Visual Studio Code o cualquier editor de texto.

Busca y reemplaza:

```js
whatsapp: "57XXXXXXXXXX",
instagram: "https://www.instagram.com/USUARIO/",
correo: "CORREO@EJEMPLO.COM",
```

Ejemplo:

```js
whatsapp: "573001234567",
instagram: "https://www.instagram.com/nebulabs3d/",
correo: "ventas@tudominio.com",
```

Guarda el archivo.

### Paso 3. Revisar la página

1. Regresa a la carpeta principal.
2. Haz doble clic en `index.html`.
3. Revisa que se vea el catálogo.
4. Prueba el buscador y los filtros.
5. Confirma que los botones de WhatsApp abran el número correcto.

---

## Parte 2. Crear el repositorio en GitHub

### Paso 4. Ingresar a GitHub

1. Abre GitHub en el navegador.
2. Inicia sesión o crea una cuenta.
3. En la parte superior derecha, haz clic en el símbolo **+**.
4. Selecciona **New repository**.

### Paso 5. Crear el repositorio

Completa así:

- **Repository name:** `nebulabs-studio-jd-3d`
- **Description:** `Catálogo web de NebuLabs Studio J.D 3D`
- **Visibility:** `Public`

No es necesario agregar README, licencia ni `.gitignore`, porque el paquete ya contiene los archivos necesarios.

Haz clic en **Create repository**.

---

## Parte 3. Subir el sitio completo

### Paso 6. Cargar los archivos

En el repositorio vacío:

1. Haz clic en **uploading an existing file**.
   - Si el repositorio ya tiene archivos, utiliza **Add file > Upload files**.
2. Abre en Windows la carpeta `nebulabs-studio-jd-3d`.
3. Selecciona **todo el contenido que está dentro de la carpeta**.
4. Arrastra los archivos y carpetas hacia la ventana de GitHub.
5. Espera a que termine la carga.

La raíz del repositorio debe quedar así:

```text
index.html
404.html
assets/
README.md
.nojekyll
...
```

No debe quedar así:

```text
nebulabs-studio-jd-3d/index.html
```

El archivo `index.html` debe estar directamente en la raíz.

### Paso 7. Guardar los archivos

1. En **Commit changes**, escribe:

```text
Publicación inicial del catálogo NebuLabs 3D
```

2. Haz clic en **Commit changes**.

---

## Parte 4. Activar GitHub Pages

### Paso 8. Configurar la publicación

1. Dentro del repositorio, abre la pestaña **Settings**.
2. En el menú izquierdo, busca **Pages**.
3. En **Build and deployment**, ubica **Source**.
4. Selecciona **Deploy from a branch**.
5. En **Branch**, selecciona `main`.
6. En la carpeta, selecciona `/(root)`.
7. Haz clic en **Save**.

### Paso 9. Esperar la publicación

La primera publicación puede tardar varios minutos. GitHub indica que los cambios pueden tardar hasta aproximadamente 10 minutos en verse reflejados.

Después, la dirección tendrá este formato:

```text
https://TU-USUARIO.github.io/nebulabs-studio-jd-3d/
```

Ejemplo:

```text
https://cristian3d.github.io/nebulabs-studio-jd-3d/
```

Para encontrar el enlace:

1. Regresa a **Settings > Pages**.
2. Busca el mensaje que indica que el sitio está publicado.
3. Haz clic en **Visit site**.

---

## Parte 5. Insertarlo en Google Sites

Cuando GitHub Pages ya esté publicado:

1. Abre tu página en Google Sites.
2. En el panel derecho, selecciona **Insertar**.
3. Haz clic en **Insertar** o **Incorporar**.
4. Selecciona la opción para usar una URL.
5. Pega la dirección de GitHub Pages.
6. Haz clic en **Insertar**.
7. Ajusta el tamaño del bloque.
8. Publica los cambios de Google Sites.

También puedes usar una **inserción de página completa** para que el catálogo ocupe toda una página dentro de Google Sites.

---

## Parte 6. Actualizar el sitio después

Cada vez que cambies precios, medidas, textos o imágenes:

1. Modifica los archivos en tu computador.
2. En GitHub, abre el repositorio.
3. Selecciona **Add file > Upload files**.
4. Carga únicamente los archivos modificados, respetando la misma carpeta.
5. Confirma el reemplazo.
6. Haz clic en **Commit changes**.
7. Espera unos minutos para que GitHub Pages publique la nueva versión.

También puedes editar archivos de texto directamente en GitHub:

1. Abre el archivo, por ejemplo `assets/js/config.js`.
2. Haz clic en el icono del lápiz.
3. Realiza el cambio.
4. Haz clic en **Commit changes**.

---

## Solución de problemas

### La página muestra error 404

Verifica:

- Que `index.html` esté en la raíz.
- Que Pages use la rama `main`.
- Que la carpeta seleccionada sea `/(root)`.
- Que el repositorio sea público.
- Que hayas esperado varios minutos después del último cambio.

### Las imágenes no aparecen

Verifica:

- Que la carpeta `assets/images/productos/` esté completa.
- Que no hayas cambiado los nombres de las imágenes.
- Que se hayan conservado las mayúsculas y minúsculas exactamente.

### Los botones de WhatsApp no funcionan

Abre `assets/js/config.js` y confirma que:

- El número no tenga `+`.
- No tenga espacios ni guiones.
- Incluya `57` al inicio si corresponde a Colombia.
- No conserve la palabra `XXXXXXXXXX`.

### Se ve una franja que dice “Antes de publicar”

La franja desaparece automáticamente cuando configuras correctamente WhatsApp, Instagram y correo en `assets/js/config.js`.
