/* ===========================================================
   PHOTO PARALLAX — profile photo tilts and drifts toward the
   cursor, floating in front of the 3D scene behind it.
   =========================================================== */
(function () {
  const wrap = document.getElementById('heroPhotoWrap');
  const container = document.getElementById('heroVisual');
  if (!wrap || !container) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const MAX_ROTATE = 16;   // degrees
  const MAX_SHIFT = 16;    // px

  let targetX = 0, targetY = 0;
  let curX = 0, curY = 0;
  let hovering = false;

  container.addEventListener('pointermove', (e) => {
    const r = container.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width) * 2 - 1;   // -1 .. 1
    targetY = ((e.clientY - r.top) / r.height) * 2 - 1;   // -1 .. 1
  });

  container.addEventListener('pointerenter', () => { hovering = true; });
  container.addEventListener('pointerleave', () => {
    hovering = false;
    targetX = 0;
    targetY = 0;
  });

  function loop() {
    curX += (targetX - curX) * 0.07;
    curY += (targetY - curY) * 0.07;

    const rotateY = curX * MAX_ROTATE;
    const rotateX = -curY * MAX_ROTATE;
    const shiftX = curX * MAX_SHIFT;
    const shiftY = curY * MAX_SHIFT;
    const scale = hovering ? 1.04 : 1;

    wrap.style.transform =
      `translate(-50%,-50%) translate(${shiftX}px, ${shiftY}px) ` +
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

    requestAnimationFrame(loop);
  }
  loop();
})();
