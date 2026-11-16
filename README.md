# VELORA Creative Studio — Web oficial

**Digital experiences. Lasting impressions.**

Web oficial de VELORA Creative Studio, estudio de diseño y desarrollo web para restaurantes, barberías,
centros de belleza, pequeños negocios y marcas independientes (España e internacional).

HTML5 + CSS3 + JavaScript puro: sin frameworks, sin dependencias y sin paso de compilación.
Lista para GitHub Pages.

---

## Estructura

```
velora-creative-studio/
├── index.html            Página única (Hero, Services, Works, Process, About, Contact, Footer)
├── 404.html              Página de error para GitHub Pages
├── robots.txt / sitemap.xml
├── .nojekyll             Evita que GitHub Pages procese el sitio con Jekyll
└── assets/
    ├── css/styles.css    Estilos (tokens de color y tipografía al principio)
    ├── js/config.js      ← DATOS EDITABLES: email, formulario, redes sociales
    ├── js/main.js        Menú, animaciones, formulario
    └── img/              Capturas del portfolio (WebP), favicon, imagen Open Graph
```

## Datos configurables (`assets/js/config.js`)

La web **no muestra ningún dato de contacto inventado**. Todo lo que esté vacío permanece oculto.

```js
window.VELORA_CONFIG = {
  contactEmail: "",      // p. ej. "hola@tudominio.com" → aparece en la sección Contact
  formEndpoint: "",      // URL de Formspree u otro servicio → el formulario envía de verdad
  social: { instagram: "", linkedin: "", behance: "", dribbble: "" } // solo URLs reales (https://)
};
```

### El formulario de contacto

- **Sin `formEndpoint`** (estado actual): funciona en **modo demostración**. Valida los campos, muestra
  el aviso *“Demo form… no message will be sent”* y **no envía nada**. Si hay `contactEmail`, ofrece
  abrir el mensaje en la app de correo del usuario.
- **Para conectarlo** (ejemplo con Formspree, gratuito):
  1. Crea una cuenta en <https://formspree.io> y un nuevo formulario.
  2. Copia la URL que te dan (`https://formspree.io/f/xxxxxxx`).
  3. Pégala en `formEndpoint` dentro de `config.js` y publica.
  4. El aviso de demo desaparece automáticamente y los mensajes llegan a tu correo.

  Sirve cualquier servicio que acepte `POST` con `FormData` y responda `2xx`
  (Formspree, Getform, Basin…). Campos enviados: `name`, `email`, `business`, `project_type`, `message`.

## Portfolio

Bistro Noir y Monarch Barber se presentan claramente como **concept projects** (marcas ficticias, no clientes reales).
Las imágenes son capturas reales de las webs publicadas. Para regenerarlas tras cambiar esos proyectos,
haz una captura a 1440×810 y expórtala en WebP a 1440 y 800 px de ancho con los mismos nombres de archivo.

---

## Ejecutar en local

Abrir `index.html` con doble clic funciona, pero es mejor usar un servidor local:

```bash
cd velora-creative-studio
python3 -m http.server 8000
```

Y abre <http://localhost:8000>.

## Publicar en GitHub Pages (paso a paso)

1. **Crea el repositorio** en GitHub llamado exactamente `velora-creative-studio`
   (público, sin README ni .gitignore, para que esté vacío).
2. **Sube el proyecto** desde esta carpeta:

   ```bash
   cd velora-creative-studio
   git init
   git add .
   git commit -m "VELORA Creative Studio website"
   git branch -M main
   git remote add origin https://github.com/aarongarcia1/velora-creative-studio.git
   git push -u origin main
   ```
3. **Activa Pages**: en el repositorio → *Settings* → *Pages* → *Build and deployment* →
   *Source: Deploy from a branch* → *Branch: `main`* / carpeta `/ (root)` → *Save*.
4. Espera 1–2 minutos. La web quedará en:
   **<https://aarongarcia1.github.io/velora-creative-studio/>**
5. **Comprueba** la portada, el menú móvil, los botones *View project* y que la imagen de previsualización
   aparece al compartir el enlace (puedes usar <https://www.opengraph.xyz>).

### Si cambias la URL (otro usuario, otro nombre de repo o dominio propio)

Sustituye `https://aarongarcia1.github.io/velora-creative-studio/` en:

- `index.html` → `canonical`, `og:url`, `og:image`, `twitter:image` y el bloque JSON-LD
- `robots.txt` y `sitemap.xml`
- `404.html` → las rutas `/velora-creative-studio/` (con dominio propio, usa simplemente `/`)

Para un dominio propio: *Settings → Pages → Custom domain*, y configura el DNS según la guía de GitHub.

### Actualizar la web más adelante

```bash
git add .
git commit -m "Describe el cambio"
git push
```

GitHub Pages republica automáticamente en uno o dos minutos.

---

## Calidad

- Responsive (móvil, tablet, escritorio) y menú móvil accesible (Esc para cerrar, foco retenido).
- Animaciones suaves que se desactivan con *prefers-reduced-motion*.
- SEO básico: título, descripción, canonical, Open Graph, Twitter Card, JSON-LD, sitemap y robots.
- Accesibilidad: enlace “Skip to content”, foco visible, etiquetas en formularios, errores anunciados.
- Imágenes WebP con `srcset`, `loading="lazy"` y dimensiones fijas (sin saltos de diseño).

© 2026 VELORA Creative Studio.
