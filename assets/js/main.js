/* VELORA Creative Studio — interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var config = window.VELORA_CONFIG || {};
  var lang = (document.documentElement.lang || 'es').slice(0, 2);
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- UI strings ---------- */
  var STRINGS = {
    es: {
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
      errName: 'Escribe tu nombre completo.',
      errEmail: 'Escribe un correo electrónico válido.',
      errType: 'Elige un tipo de proyecto.',
      errMessage: 'Cuéntanos un poco más (mínimo 10 caracteres).',
      errConsent: 'Necesitamos tu consentimiento para poder responderte.',
      review: 'Revisa los campos marcados.',
      sending: 'Enviando…',
      sent: 'Gracias. Hemos recibido tu solicitud y te responderemos lo antes posible.',
      failed: 'No se ha podido enviar el mensaje. Inténtalo de nuevo en unos minutos',
      failedEmail: ' o escríbenos a ',
      inactive: 'El formulario aún no está activo, así que tu mensaje no se ha enviado.',
      inactiveEmail: 'El envío online aún no está activo. Puedes enviarnos la solicitud por correo: ',
      openMail: 'abrir en tu aplicación de correo',
      noteEmail: ' Mientras tanto, puedes escribirnos a ',
      mailSubject: 'Nueva solicitud de proyecto',
      mailName: 'Nombre', mailEmail: 'Correo', mailBusiness: 'Negocio', mailType: 'Tipo de proyecto'
    },
    en: {
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      errName: 'Please enter your full name.',
      errEmail: 'Please enter a valid email address.',
      errType: 'Please choose a type of project.',
      errMessage: 'Please tell us a little more (at least 10 characters).',
      errConsent: 'We need your consent to be able to reply.',
      review: 'Please review the highlighted fields.',
      sending: 'Sending…',
      sent: 'Thank you. We have received your enquiry and will get back to you as soon as possible.',
      failed: 'Your message could not be sent. Please try again in a few minutes',
      failedEmail: ' or email us at ',
      inactive: 'The form is not active yet, so your message has not been sent.',
      inactiveEmail: 'Online sending is not active yet. You can send your enquiry by email: ',
      openMail: 'open it in your email app',
      noteEmail: ' In the meantime, you can email us at ',
      mailSubject: 'New project enquiry',
      mailName: 'Name', mailEmail: 'Email', mailBusiness: 'Business', mailType: 'Type of project'
    }
  };
  var t = STRINGS[lang] || STRINGS.es;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Hero entrance ---------- */
  var hero = $('.hero');
  function startHero() { if (hero) hero.classList.add('is-ready'); }
  if (document.fonts && document.fonts.ready) {
    // Wait for fonts (max 600 ms) to avoid animating fallback type
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 600); })]).then(startHero);
  } else {
    startHero();
  }

  /* ---------- Header state ---------- */
  var header = $('.site-header');
  function onScrollHeader() { header.classList.toggle('is-scrolled', window.scrollY > 24); }
  onScrollHeader();

  /* ---------- Language switch: keep the current section ---------- */
  $$('[data-lang-link]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (a.getAttribute('aria-current') === 'page') return;
      if (location.hash && /^#[\w-]+$/.test(location.hash)) a.href = a.href.split('#')[0] + location.hash;
    });
  });

  // Smooth scrolling only after load, so arriving at /#section (e.g. from the
  // other language) jumps straight there instead of animating from the top.
  window.addEventListener('load', function () {
    setTimeout(function () { document.documentElement.classList.add('is-loaded'); }, 50);
  });

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle');
  var menu = $('#mobile-menu');
  var lastFocus = null;
  var isOpen = function () { return toggle.getAttribute('aria-expanded') === 'true'; };

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? t.menuClose : t.menuOpen);
    document.body.classList.toggle('menu-open', open);
    var main = $('#main');
    var footer = $('.footer');
    if (main) main.inert = open;
    if (footer) footer.inert = open;
    if (open) {
      lastFocus = document.activeElement;
      menu.hidden = false;
      void menu.offsetHeight; // force a reflow so the opening transition runs
      menu.classList.add('is-open');
      var first = $('a', menu);
      if (first) first.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduceMotion ? 0 : 500);
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', function () { setMenu(!isOpen()); });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { setMenu(false); return; }
    if (e.key === 'Tab') { // keep focus inside menu, toggle and language switch
      var items = [toggle].concat($$('.lang-switch a'), $$('a', menu));
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  var desktopMQ = window.matchMedia('(min-width: 1081px)');
  var onMQ = function (mq) { if (mq.matches && isOpen()) setMenu(false); };
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onMQ);
  else if (desktopMQ.addListener) desktopMQ.addListener(onMQ); // Safari < 14

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = $$('[data-reveal], [data-steps]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = $$('.nav-list a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var active = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Subtle hero parallax ---------- */
  var parallaxEls = $$('[data-parallax]');
  var ticking = false;
  function updateParallax() {
    var y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      parallaxEls.forEach(function (el) {
        el.style.transform = 'translate3d(0,' + (y * parseFloat(el.dataset.parallax)).toFixed(1) + 'px,0)';
      });
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    onScrollHeader();
    if (!reduceMotion && parallaxEls.length && !ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });

  /* ---------- Configurable contact details ---------- */
  var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var contactEmail = (config.contactEmail || '').trim();
  if (!emailValid.test(contactEmail)) contactEmail = '';

  if (contactEmail) {
    var emailLink = $('[data-contact-email-link]');
    emailLink.href = 'mailto:' + contactEmail;
    emailLink.textContent = contactEmail;
    $('[data-contact-email]').hidden = false;
  }

  var contactPhone = (config.contactPhone || '').replace(/[^\d+]/g, '');
  if (!/^\+\d{8,15}$/.test(contactPhone)) contactPhone = '';
  if (contactPhone) {
    var phoneLink = $('[data-contact-phone-link]');
    phoneLink.href = 'tel:' + contactPhone;
    // "+34684112184" -> "+34 684 11 21 84"
    phoneLink.textContent = contactPhone.indexOf('+34') === 0 && contactPhone.length === 12
      ? contactPhone.replace(/^(\+34)(\d{3})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')
      : contactPhone;
    $('[data-contact-whatsapp-link]').href = 'https://wa.me/' + contactPhone.slice(1);
    $('[data-contact-phone]').hidden = false;
  }

  var socialLabels = { instagram: 'Instagram', linkedin: 'LinkedIn', behance: 'Behance', dribbble: 'Dribbble' };
  var social = config.social || {};
  var socialList = $('[data-social-list]');
  Object.keys(social).forEach(function (key) {
    var url = (social[key] || '').trim();
    if (!/^https:\/\/\S+$/.test(url)) return;
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = socialLabels[key] || key;
    li.appendChild(a); socialList.appendChild(li);
  });
  if (socialList.children.length) $('[data-contact-social]').hidden = false;
  $('[data-contact-details]').hidden = !contactEmail && !contactPhone && !socialList.children.length;

  /* ---------- Contact form ---------- */
  var form = $('#contact-form');
  var status = $('[data-form-status]');
  var submitBtn = $('[data-submit]');
  var note = $('[data-form-note]');
  var endpoint = (config.formEndpoint || '').trim();
  var isLive = /^https:\/\/\S+$/.test(endpoint);

  if (isLive) {
    // A real form service is configured: remove the "not active" notice.
    note.parentNode.removeChild(note);
    form.removeAttribute('aria-describedby');
    form.action = endpoint; // also lets the form work if JS fails mid-way
  } else if (contactEmail) {
    note.insertAdjacentHTML('beforeend', escapeHtml(t.noteEmail) +
      '<a href="mailto:' + escapeHtml(contactEmail) + '">' + escapeHtml(contactEmail) + '</a>.');
  }

  var rules = {
    name: function (f) { return f.value.trim().length >= 2 ? '' : t.errName; },
    email: function (f) { return emailValid.test(f.value.trim()) ? '' : t.errEmail; },
    project_type: function (f) { return f.value ? '' : t.errType; },
    message: function (f) { return f.value.trim().length >= 10 ? '' : t.errMessage; },
    consent: function (f) { return f.checked ? '' : t.errConsent; }
  };

  function validateField(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var msg = rule(field);
    var wrap = field.closest('.field');
    var err = $('#' + field.id + '-err');
    wrap.classList.toggle('has-error', !!msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) {
      err.textContent = msg;
      if (msg) field.setAttribute('aria-describedby', err.id); else field.removeAttribute('aria-describedby');
    }
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    var field = form.elements[name];
    var evt = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener('blur', function () { if (field.value && field.type !== 'checkbox') validateField(field); });
    field.addEventListener(evt, function () {
      if (field.closest('.field').classList.contains('has-error')) validateField(field);
    });
  });

  function setStatus(html, kind) {
    status.innerHTML = html;
    status.classList.toggle('is-success', kind === 'success');
    status.classList.toggle('is-error', kind === 'error');
  }

  function buildMailto(data) {
    var body = t.mailName + ': ' + data.get('name') + '\n' +
      t.mailEmail + ': ' + data.get('email') + '\n' +
      t.mailBusiness + ': ' + (data.get('business') || '-') + '\n' +
      t.mailType + ': ' + data.get('project_type') + '\n\n' +
      data.get('message');
    return 'mailto:' + contactEmail + '?subject=' + encodeURIComponent(t.mailSubject) +
      '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var f = form.elements[name];
      if (!validateField(f) && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      setStatus(escapeHtml(t.review), 'error');
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);

    if (!isLive) {
      // No form service yet: never pretend the message was sent.
      if (contactEmail) {
        setStatus(escapeHtml(t.inactiveEmail) + '<a href="' + escapeHtml(buildMailto(data)) + '">' +
          escapeHtml(t.openMail) + '</a>.');
      } else {
        setStatus(escapeHtml(t.inactive), 'error');
      }
      return;
    }

    submitBtn.disabled = true;
    form.setAttribute('aria-busy', 'true');
    setStatus(escapeHtml(t.sending));

    fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (!res.ok) {
            var detail = json && json.errors && json.errors.length
              ? json.errors.map(function (er) { return er.message; }).join(' ') : '';
            var err = new Error(detail || 'HTTP ' + res.status);
            err.detail = detail;
            throw err;
          }
          return json;
        });
      })
      .then(function () {
        form.reset();
        $$('.field.has-error', form).forEach(function (f) { f.classList.remove('has-error'); });
        setStatus(escapeHtml(t.sent), 'success');
      })
      .catch(function (err) {
        var msg = escapeHtml(t.failed);
        if (contactEmail) {
          msg += escapeHtml(t.failedEmail) + '<a href="mailto:' + escapeHtml(contactEmail) + '">' + escapeHtml(contactEmail) + '</a>';
        }
        msg += '.';
        if (err && err.detail) msg += ' <span class="form-status-detail">(' + escapeHtml(err.detail) + ')</span>';
        setStatus(msg, 'error');
      })
      .then(function () {
        submitBtn.disabled = false;
        form.removeAttribute('aria-busy');
      });
  });
})();
