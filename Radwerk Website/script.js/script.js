/* =========================================================
   RadWerk — script.js
   Sticky nav shadow, mobile menu, smooth scroll, FAQ accordion,
   before/after tap toggle, scroll reveal, contact form validation.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header state on scroll ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  function closeNav() {
    primaryNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = primaryNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close mobile nav after a link is tapped */
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  /* ---------- Smooth scroll with sticky-header offset ---------- */
  var headerOffset = 76;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.pushState(null, '', targetId);
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      var panel = trigger.nextElementSibling;

      /* Close any other open panels for a single-open accordion */
      document.querySelectorAll('.accordion-trigger').forEach(function (other) {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Before/After: tap-to-reveal on touch devices ---------- */
  document.querySelectorAll('.ba-card').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('revealed');
    });
  });

  /* ---------- Scroll reveal for sections ---------- */
  var revealTargets = document.querySelectorAll(
    '.about-copy, .about-media, .ba-card, .spec-item, .why-card, .contact-copy, .contact-form'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  function setError(fieldId, message) {
    var errorEl = document.getElementById(fieldId + 'Error');
    var row = document.getElementById(fieldId).closest('.form-row');
    if (errorEl) errorEl.textContent = message || '';
    if (row) row.classList.toggle('invalid', Boolean(message));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      var valid = true;

      if (!name.value.trim()) {
        setError('name', 'Please enter your name.');
        valid = false;
      } else {
        setError('name', '');
      }

      if (!email.value.trim() || !isValidEmail(email.value.trim())) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
      } else {
        setError('email', '');
      }

      if (!message.value.trim()) {
        setError('message', 'Let us know what\'s going on with your vehicle.');
        valid = false;
      } else {
        setError('message', '');
      }

      if (!valid) {
        status.textContent = 'Please fix the highlighted fields.';
        status.style.color = '#ff7a7a';
        return;
      }

      /* No backend is wired up yet — replace this block with a real
         fetch()/AJAX call to your form endpoint or email service. */
      status.style.color = 'var(--accent)';
      status.textContent = 'Thanks! Your request has been received — we\'ll follow up shortly.';
      form.reset();
    });
  }

});
