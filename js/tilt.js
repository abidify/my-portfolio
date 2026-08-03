/* ===========================================================
   3D TILT — mouse-driven tilt for cards (project, skill, about)
   =========================================================== */
(function () {
  const tiltEls = document.querySelectorAll('[data-tilt], #aboutTilt');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const MAX_TILT = 10; // degrees

  tiltEls.forEach((el) => {
    let bounds;

    function onEnter() {
      bounds = el.getBoundingClientRect();
      el.style.transition = 'transform .1s ease-out';
    }

    function onMove(e) {
      if (!bounds) bounds = el.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width;  // 0 -> 1
      const y = (e.clientY - bounds.top) / bounds.height;  // 0 -> 1

      const rotY = (x - 0.5) * MAX_TILT * 2;
      const rotX = (0.5 - y) * MAX_TILT * 2;

      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    }

    function onLeave() {
      el.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    }

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
})();
