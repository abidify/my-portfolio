/* ===========================================================
   MAIN — cursor, nav, scroll reveals, counters, form
   =========================================================== */

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- custom cursor ---------- */
(function () {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  function loop() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, input, textarea, [data-tilt]').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
})();

/* ---------- mobile nav ---------- */
(function () {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (!burger || !mobile) return;

  burger.addEventListener('click', () => {
    mobile.classList.toggle('open');
  });
  mobile.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => mobile.classList.remove('open'))
  );
})();

/* ---------- scroll reveal ---------- */
(function () {
  const targets = document.querySelectorAll(
    '.section-head, .about-text, .about-card, .skill-card, .project-card, .timeline-item, .contact-form, .contact-side'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => io.observe(el));
})();

/* ---------- nav background on scroll ---------- */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener(
    'scroll',
    () => {
      nav.style.boxShadow = window.scrollY > 40 ? '0 8px 30px -16px rgba(0,0,0,.5)' : 'none';
    },
    { passive: true }
  );
})();

/* ---------- animated stat counters ---------- */
(function () {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((el) => io.observe(el));
})();

/* ---------- contact form (front-end only — wire to a backend or
   a service like Formspree to actually receive messages) ---------- */
(function () {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = 'Thanks! This form is a front-end demo — connect it to Formspree, EmailJS, or your own backend to actually receive messages.';
    form.reset();
  });
})();
