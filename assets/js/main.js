/* VELORA Creative Studio — interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var config = window.VELORA_CONFIG || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

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

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle');
  var menu = $('#mobile-menu');
  var lastFocus = null;

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) {
      lastFocus = document.activeElement;
      menu.hidden = false;
      // next frame so the transition runs
      requestAnimationFrame(function () {
        menu.classList.add('is-open');
        var first = $('a', menu);
        if (first) first.focus({ preventScroll: true });
      });
    } else {
      menu.classList.remove('is-open');
      setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduceMotion ? 0 : 500);
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (e.key === 'Escape') { setMenu(false); return; }
    if (e.key === 'Tab') { // keep focus inside menu + toggle
      var items = [toggle].concat($$('a', menu));
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (mq) {
    if (mq.matches && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  });

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
          if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
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
  var emailWrap = $('[data-contact-email]');
  var emailLink = $('[data-contact-email-link]');
  var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var contactEmail = (config.contactEmail || '').trim();
  if (contactEmail && emailValid.test(contactEmail)) {
    emailLink.href = 'mailto:' + contactEmail;
    emailLink.textContent = contactEmail;
    emailWrap.hidden = false;
  } else {
    contactEmail = '';
  }

  var socialLabels = { instagram: 'Instagram', linkedin: 'LinkedIn', behance: 'Behance', dribbble: 'Dribbble' };
  var social = config.social || {};
  var socialList = $('[data-social-list]');
  Object.keys(social).forEach(function (key) {
    var url = (social[key] || '').trim();
    if (!/^https:\/\//.test(url)) return;
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = socialLabels[key] || key;
    li.appendChild(a); socialList.appendChild(li);
  });
  if (socialList.children.length) $('[data-contact-social]').hidden = false;
  $('[data-contact-details]').hidden = !contactEmail && !socialList.children.length;

  /* ---------- Contact form ---------- */
  var form = $('#contact-form');
  var status = $('[data-form-status]');
  var submitBtn = $('[data-submit]');
  var endpoint = (config.formEndpoint || '').trim();
  var isLive = /^https:\/\//.test(endpoint);

  if (isLive) {
    // Real backend configured: replace the demo notice.
    var note = $('[data-form-note]');
    note.parentNode.removeChild(note);
    form.removeAttribute('aria-describedby');
  }

  var rules = {
    name: function (v) { return v.length >= 2 ? '' : 'Please enter your full name.'; },
    email: function (v) { return emailValid.test(v) ? '' : 'Please enter a valid email address.'; },
    project_type: function (v) { return v ? '' : 'Please choose a type of project.'; },
    message: function (v) { return v.length >= 10 ? '' : 'Please tell us a little more (at least 10 characters).'; }
  };

  function validateField(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var msg = rule(field.value.trim());
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

  $$('input, select, textarea', form).forEach(function (field) {
    field.addEventListener('blur', function () { if (field.value) validateField(field); });
    field.addEventListener('input', function () {
      if (field.closest('.field').classList.contains('has-error')) validateField(field);
    });
  });

  function setStatus(html, success) {
    status.innerHTML = html;
    status.classList.toggle('is-success', !!success);
  }

  function buildMailto(data) {
    var body = 'Full name: ' + data.get('name') + '\n' +
      'Email: ' + data.get('email') + '\n' +
      'Business: ' + (data.get('business') || '-') + '\n' +
      'Type of project: ' + data.get('project_type') + '\n\n' +
      data.get('message');
    return 'mailto:' + contactEmail + '?subject=' + encodeURIComponent('New project enquiry') +
      '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = $$('[name]', form);
    var firstInvalid = null;
    fields.forEach(function (f) { if (!validateField(f) && !firstInvalid) firstInvalid = f; });
    if (firstInvalid) {
      setStatus('Please review the highlighted fields.');
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);

    if (!isLive) {
      // DEMO mode — be explicit that nothing was sent.
      var msg = 'Thank you. The details are valid, but <strong>this is a demo form and no message has been sent.</strong>';
      if (contactEmail) {
        msg += ' You can <a href="' + buildMailto(data).replace(/"/g, '&quot;') + '">send it from your email app</a> instead.';
      }
      setStatus(msg);
      return;
    }

    submitBtn.disabled = true;
    setStatus('Sending…');
    fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        form.reset();
        setStatus('Thank you — your message has been sent. We will get back to you soon.', true);
      })
      .catch(function () {
        setStatus('Sorry, the message could not be sent. Please try again later' +
          (contactEmail ? ' or write to <a href="mailto:' + contactEmail + '">' + contactEmail + '</a>.' : '.'));
      })
      .then(function () { submitBtn.disabled = false; });
  });
})();
