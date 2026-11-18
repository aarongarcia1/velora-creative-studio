/**
 * VELORA — site configuration (shared by the Spanish and English pages)
 * ---------------------------------------------------------------------------
 * Fill in ONLY real data. Anything left empty ("") stays hidden on the site,
 * so nothing fictitious is ever shown. After editing this file run
 * `python3 build.py` (updates the ?v= version so browsers load the new
 * copy), then commit and push.
 *
 *  contactEmail  Public contact email, e.g. "hola@tudominio.com".
 *                Shown in the Contact section and used as a fallback if the
 *                online form is not configured or fails.
 *
 *  formEndpoint  Endpoint of the form service that receives the enquiries.
 *                Recommended: Formspree → "https://formspree.io/f/XXXXXXXX".
 *                Any service that accepts a POST with form data and answers
 *                with JSON works (see README → "Formulario").
 *                While empty, the form clearly says it is not active yet and
 *                nothing is "sent".
 *
 *  contactPhone  Public phone number in international format, e.g. "+34600000000".
 *                Shown as a call link plus a WhatsApp link.
 *
 *  social        Real profile URLs only (must start with https://).
 */
window.VELORA_CONFIG = {
  contactEmail: "studio.velora.web@gmail.com",
  contactPhone: "+34684112184",
  formEndpoint: "https://formspree.io/f/xvkaaeqv",
  social: {
    instagram: "",
    linkedin: "",
    behance: "",
    dribbble: ""
  }
};
