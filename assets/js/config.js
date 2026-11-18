/**
 * VELORA — site configuration (shared by the Spanish and English pages)
 * ---------------------------------------------------------------------------
 * Fill in ONLY real data. Anything left empty ("") stays hidden on the site,
 * so nothing fictitious is ever shown. No rebuild is needed after editing
 * this file: just commit and push.
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
 *  social        Real profile URLs only (must start with https://).
 */
window.VELORA_CONFIG = {
  contactEmail: "studio.velora.web@gmail.com",
  formEndpoint: "",
  social: {
    instagram: "",
    linkedin: "",
    behance: "",
    dribbble: ""
  }
};
