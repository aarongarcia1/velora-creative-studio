# VELORA Creative Studio — Web oficial

**Digital experiences. Lasting impressions.**

Web oficial de VELORA Creative Studio, estudio de diseño y desarrollo web para restaurantes, barberías,
centros de belleza, pequeños negocios y marcas independientes (España e internacional).

- Español (predeterminado): <https://aarongarcia1.github.io/velora-creative-studio/>
- Inglés: <https://aarongarcia1.github.io/velora-creative-studio/en/>

HTML5 + CSS3 + JavaScript puro, sin frameworks ni dependencias. Lista para GitHub Pages.

---

## Estructura

```
velora-creative-studio/
├── index.html              ← GENERADO (español)  · no editar a mano
├── en/index.html           ← GENERADO (inglés)   · no editar a mano
├── sitemap.xml             ← GENERADO (con hreflang ES/EN)
├── build.py                Genera las páginas a partir de la plantilla y las traducciones
├── src/
│   ├── template.html       Estructura HTML común a los dos idiomas
│   └── i18n/
│       ├── es.json         Todos los textos en español
│       └── en.json         Todos los textos en inglés
├── assets/
│   ├── css/styles.css      Estilos (colores y tipografías al principio)
│   ├── js/config.js        ← DATOS DE CONTACTO Y FORMULARIO (editar aquí)
│   ├── js/main.js          Menú, animaciones, formulario, mensajes ES/EN
│   └── img/                Capturas del portfolio (AVIF + WebP), favicon, imagen Open Graph
├── 404.html                Página de error bilingüe
├── robots.txt
└── .nojekyll
```

## Idiomas (ES / EN)

- El español está en la raíz (`/`) y el inglés en `/en/`. Cada idioma tiene su propia URL, título,
  descripción, Open Graph y etiquetas `hreflang`, para que Google indexe ambos correctamente.
- El selector **ES / EN** de la cabecera mantiene la sección en la que estás (por ejemplo `#contact`).
- El eslogan *“Digital experiences. Lasting impressions.”* se mantiene en inglés en ambas versiones,
  como firma de marca.

### Cambiar un texto

1. Edita el texto en `src/i18n/es.json` **y** en `src/i18n/en.json` (misma clave en los dos).
2. Regenera las páginas:

   ```bash
   python3 build.py
   ```
3. Publica (ver más abajo). Si falta una traducción, `build.py` se detiene y te dice qué clave falta.

Los mensajes del formulario (errores, “Enviando…”, etc.) están en `assets/js/main.js`, en el bloque `STRINGS`.

---

## Formulario de contacto

El formulario está preparado para enviar solicitudes **reales** a través de un servicio externo. Mientras
no lo conectes, **no simula nada**: muestra el aviso “Formulario en configuración” y, al pulsar enviar,
indica claramente que el mensaje no se ha enviado.

### Qué necesitas crear: una cuenta de Formspree (recomendado, tiene plan gratuito)

1. Entra en <https://formspree.io> y crea una cuenta **con el correo donde quieres recibir las solicitudes**.
   Confirma ese correo desde el email que te envían.
2. Pulsa **+ New Form**, ponle un nombre (por ejemplo “VELORA web”) y créalo.
3. Copia la dirección del formulario. Tiene esta forma: `https://formspree.io/f/abcdwxyz`
4. Pégala en `assets/js/config.js`:

   ```js
   formEndpoint: "https://formspree.io/f/abcdwxyz",
   ```
5. Ejecuta `python3 build.py` (actualiza la versión `?v=` para que los navegadores carguen los cambios) y publica con `git add`, `commit` y `push`.
6. Haz una prueba real desde la web publicada y comprueba que el mensaje llega a tu correo
   y aparece en el panel de Formspree.

Cuando está conectado, el aviso de “en configuración” desaparece solo y el formulario:
- valida los campos y el consentimiento antes de enviar,
- envía nombre, email, negocio, tipo de proyecto, mensaje, idioma (`es`/`en`) y un asunto distinto por idioma,
- incluye un campo trampa anti-spam (`_gotcha`), que Formspree reconoce,
- muestra “Gracias, hemos recibido tu solicitud” solo si el servicio confirma la recepción,
- si falla, lo dice y ofrece el correo de contacto como alternativa (si lo has configurado).

Recomendable en el panel de Formspree: activar la protección anti-spam y, si tu plan lo permite,
restringir los envíos al dominio `aarongarcia1.github.io`. Revisa los límites del plan gratuito en su web.

**Alternativas** compatibles sin tocar el código (aceptan `POST` y responden en JSON): Getform, Basin, FormBold…
Basta con pegar su dirección en `formEndpoint`.

### Correo de contacto (alternativa al formulario)

Cuando tengas un correo profesional, añádelo en `config.js`:

```js
contactEmail: "hola@tudominio.com",
```

- Aparecerá en la sección de contacto (“Escríbenos directamente” / “Email us directly”).
- Si el formulario aún no está conectado, el botón de enviar ofrecerá abrir la solicitud ya redactada
  en la aplicación de correo del visitante.
- Si el formulario falla, se ofrecerá el correo como alternativa.

### Redes sociales

En `config.js` → `social`, pega solo URLs reales que empiecen por `https://`. Las vacías no se muestran.

### Aviso legal y privacidad (importante en España / UE)

El formulario incluye una casilla de consentimiento obligatoria. Para cumplir completamente con el RGPD
y la LSSI, cuando tengas los datos reales del responsable (nombre o razón social, NIF y contacto) conviene
añadir una página de **Política de privacidad** y **Aviso legal** y enlazarlas desde esa casilla y el pie.
No se han creado porque requieren datos reales que no deben inventarse.

---

## Ejecutar en local

```bash
cd velora-creative-studio
python3 -m http.server 8001
```

Abre <http://localhost:8001> (español) y <http://localhost:8001/en/> (inglés).

## Publicar cambios en GitHub Pages

El repositorio ya está conectado a GitHub y Pages ya está activado. Para publicar:

```bash
cd /home/alumnat/Documents/Dinero/velora-creative-studio
python3 build.py
git add .
git commit -m "Describe el cambio"
git push
```

GitHub Pages republica en 1–2 minutos. Los navegadores pueden tardar hasta ~10 minutos en dejar de usar
la versión antigua de CSS/JS en caché; si no ves el cambio, recarga con **Ctrl+Shift+R**.

### Si cambias la URL (otro usuario, otro nombre de repositorio o dominio propio)

- `build.py` → variable `SITE_URL`, y vuelve a ejecutar `python3 build.py`
- `robots.txt` → línea `Sitemap:`
- `404.html` → rutas `/velora-creative-studio/` (con dominio propio, usa `/` y `/en/`)

---

## Calidad

- Responsive revisado en móvil (320–375 px), tablet (768 px) y escritorio (1440 px), sin scroll horizontal.
- Menú móvil accesible: foco dentro del menú, cierre con Esc, el resto de la página se desactiva mientras está abierto.
- Accesibilidad: “Saltar al contenido”, foco visible (oscuro sobre fondos marfil), etiquetas y errores asociados
  a cada campo, idioma correcto en cada página, `aria-current` en idioma y sección activa, movimiento reducido respetado.
- SEO por idioma: título, descripción, canonical, `hreflang` (es, en, x-default), Open Graph, Twitter Card,
  JSON-LD con `inLanguage`, sitemap con alternativas e imagen social 1200×630.
- Rendimiento: imágenes AVIF con alternativa WebP, tamaños adaptados (`srcset` 480/800/1440), carga diferida
  fuera de la portada, dimensiones fijas (sin saltos de diseño), sin librerías externas de JavaScript.

## Portfolio

Bistro Noir y Monarch Barber se presentan como **proyectos conceptuales** (marcas ficticias, no clientes reales)
y enlazan a sus webs publicadas, que se abren en una pestaña nueva. Sus repositorios no se modifican desde aquí.

© 2026 VELORA Creative Studio.
