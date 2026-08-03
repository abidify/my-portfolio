/* ===========================================================
   HERO 3D SCENE — playful CS-themed objects, contained to the
   right-hand visual panel so they never sit behind the text.
   =========================================================== */
(function () {
  const canvas = document.getElementById('heroCanvas');
  const container = document.getElementById('heroVisual');
  if (!canvas || !container || typeof THREE === 'undefined') return;

  const palette = {
    coral: 0xff6b9d,
    cyan: 0x4ecdc4,
    yellow: 0xffd93d,
    violet: 0x8e7cff,
    dark: 0x1a1738,
    light: 0xf6f3ff,
  };

  // ---- renderer / scene / camera ----
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0.5, 14.5);

  // ---- lights ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const key = new THREE.PointLight(0xff6b9d, 2.8, 70);
  key.position.set(7, 7, 10);
  scene.add(key);
  const rim = new THREE.PointLight(0x4ecdc4, 2.4, 70);
  rim.position.set(-7, -4, 7);
  scene.add(rim);
  const fill = new THREE.PointLight(0xffd93d, 1.5, 70);
  fill.position.set(0, -7, 5);
  scene.add(fill);
  const accent = new THREE.PointLight(0x8e7cff, 1.6, 70);
  accent.position.set(0, 8, -4);
  scene.add(accent);

  /* -----------------------------------------------------------
     Small canvas-texture helper (for screens / chip / binary)
     ----------------------------------------------------------- */
  function makeTexture(size, draw) {
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    draw(ctx, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  const screenTexture = makeTexture(256, (ctx, s) => {
    ctx.fillStyle = '#120f2c';
    ctx.fillRect(0, 0, s, s);
    const colors = ['#FF6B9D', '#4ECDC4', '#FFD93D', '#8E7CFF'];
    let y = 22;
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = colors[i % colors.length];
      const indent = (i % 3) * 14 + 14;
      const w = 60 + Math.random() * (s - indent - 80);
      ctx.fillRect(indent, y, w, 9);
      y += 20;
    }
  });

  const chipTexture = makeTexture(256, (ctx, s) => {
    ctx.fillStyle = '#15122e';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(78,205,196,.55)';
    ctx.lineWidth = 2;
    const step = s / 8;
    for (let i = 1; i < 8; i++) {
      ctx.beginPath(); ctx.moveTo(i * step, 0); ctx.lineTo(i * step, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * step); ctx.lineTo(s, i * step); ctx.stroke();
    }
    ctx.fillStyle = '#FFD93D';
    ctx.fillRect(s * 0.36, s * 0.36, s * 0.28, s * 0.28);
  });

  const binaryTexture = makeTexture(256, (ctx, s) => {
    ctx.fillStyle = '#1d1846';
    ctx.fillRect(0, 0, s, s);
    ctx.font = '20px monospace';
    const colors = ['#FF6B9D', '#4ECDC4', '#FFD93D', '#F6F3FF'];
    for (let y = 0; y < 9; y++) {
      let row = '';
      for (let x = 0; x < 9; x++) row += Math.round(Math.random());
      ctx.fillStyle = colors[y % colors.length];
      ctx.globalAlpha = 0.85;
      ctx.fillText(row.split('').join(' '), 6, 26 + y * 26);
    }
    ctx.globalAlpha = 1;
  });

  /* -----------------------------------------------------------
     CS-themed object builders
     ----------------------------------------------------------- */

  function makeLaptop() {
    const g = new THREE.Group();

    const baseMat = new THREE.MeshStandardMaterial({ color: palette.light, roughness: 0.4, metalness: 0.2 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.14, 1.7), baseMat);
    base.position.y = 0;
    g.add(base);

    const padMat = new THREE.MeshStandardMaterial({ color: 0xd9d3f5, roughness: 0.6 });
    const pad = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.02, 1.3), padMat);
    pad.position.set(0, 0.08, 0.05);
    g.add(pad);

    const screenGroup = new THREE.Group();
    const screenFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 1.7, 0.1),
      new THREE.MeshStandardMaterial({ color: palette.light, roughness: 0.4, metalness: 0.2 })
    );
    screenFrame.position.set(0, 0.85, 0);
    screenGroup.add(screenFrame);

    const screenLit = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 1.4),
      new THREE.MeshBasicMaterial({ map: screenTexture })
    );
    screenLit.position.set(0, 0.85, 0.06);
    screenGroup.add(screenLit);

    screenGroup.position.set(0, 0.07, -0.78);
    screenGroup.rotation.x = -0.32;
    g.add(screenGroup);

    g.scale.setScalar(1.05);
    return g;
  }

  function makeChip() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.22, 1.7),
      new THREE.MeshStandardMaterial({ map: chipTexture, roughness: 0.45, metalness: 0.3 })
    );
    g.add(body);

    const pinMat = new THREE.MeshStandardMaterial({ color: 0xc9c2ef, metalness: 0.6, roughness: 0.3 });
    const pinCount = 6;
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < pinCount; i++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.18), pinMat);
        const offset = (i - (pinCount - 1) / 2) * 0.26;
        const edge = 0.95;
        if (side === 0) pin.position.set(offset, 0, edge);
        if (side === 1) pin.position.set(offset, 0, -edge);
        if (side === 2) { pin.position.set(edge, 0, offset); pin.rotation.y = Math.PI / 2; }
        if (side === 3) { pin.position.set(-edge, 0, offset); pin.rotation.y = Math.PI / 2; }
        g.add(pin);
      }
    }
    return g;
  }

  function makeBinaryCube() {
    const mat = new THREE.MeshStandardMaterial({ map: binaryTexture, roughness: 0.5 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3), mat);
    return mesh;
  }

  function makeMug() {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: palette.coral, roughness: 0.35, flatShading: true });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.48, 1.05, 24), bodyMat);
    g.add(body);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.09, 10, 24, Math.PI * 1.4),
      bodyMat
    );
    handle.position.set(0.62, 0, 0);
    handle.rotation.y = Math.PI / 2;
    handle.rotation.z = -0.2;
    g.add(handle);

    const steamMat = new THREE.MeshStandardMaterial({ color: palette.light, transparent: true, opacity: 0.35 });
    for (let i = -1; i <= 1; i += 2) {
      const steam = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 16, Math.PI * 1.4), steamMat);
      steam.position.set(i * 0.18, 0.78, 0);
      steam.rotation.x = Math.PI / 2;
      g.add(steam);
    }
    return g;
  }

  function makeFloppy() {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: palette.violet, roughness: 0.45, flatShading: true });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.12), bodyMat);
    g.add(body);

    const shutterMat = new THREE.MeshStandardMaterial({ color: 0xc9c2ef, metalness: 0.5, roughness: 0.4 });
    const shutter = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.16), shutterMat);
    shutter.position.set(0, 0.45, 0);
    g.add(shutter);

    const labelMat = new THREE.MeshStandardMaterial({ color: palette.light, roughness: 0.6 });
    const label = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.7, 0.02), labelMat);
    label.position.set(0, -0.2, 0.07);
    g.add(label);

    const notchMat = new THREE.MeshStandardMaterial({ color: 0x15122e });
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.2), notchMat);
    notch.position.set(-0.6, 0.6, 0);
    g.add(notch);

    return g;
  }

  function makeWifiRings() {
    const g = new THREE.Group();
    const colors = [palette.cyan, palette.coral, palette.yellow];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.42 + i * 0.34, 0.045, 10, 32, Math.PI),
        new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.4 })
      );
      ring.rotation.z = Math.PI;
      ring.position.y = -i * 0.02;
      g.add(ring);
    }
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({ color: palette.light })
    );
    dot.position.y = -0.05;
    g.add(dot);
    g.rotation.x = -0.15;
    return g;
  }

  function makeGear() {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: palette.yellow, roughness: 0.4, flatShading: true });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.16, 10, 20), mat);
    g.add(ring);
    const teeth = 8;
    for (let i = 0; i < teeth; i++) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.22), mat);
      const a = (i / teeth) * Math.PI * 2;
      tooth.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0);
      tooth.rotation.z = a;
      g.add(tooth);
    }
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: palette.dark, roughness: 0.5 })
    );
    hub.rotation.x = Math.PI / 2;
    g.add(hub);
    return g;
  }

  function makeCodeBrackets() {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: palette.cyan, roughness: 0.35, flatShading: true });
    function bracket(mirror) {
      const grp = new THREE.Group();
      const segA = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.55, 0.16), mat);
      segA.position.set(0.18, 0.32, 0);
      segA.rotation.z = mirror ? 0.6 : -0.6;
      grp.add(segA);
      const segB = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.55, 0.16), mat);
      segB.position.set(0.18, -0.32, 0);
      segB.rotation.z = mirror ? -0.6 : 0.6;
      grp.add(segB);
      if (mirror) grp.scale.x = -1;
      return grp;
    }
    const left = bracket(false);
    left.position.x = -0.45;
    g.add(left);
    const right = bracket(true);
    right.position.x = 0.45;
    g.add(right);
    const slash = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.85, 0.14), new THREE.MeshStandardMaterial({ color: palette.coral, roughness: 0.35, flatShading: true }));
    slash.rotation.z = 0.5;
    g.add(slash);
    return g;
  }

  function makeServerRack() {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a2459, roughness: 0.5, metalness: 0.2 });
    const ledColors = [palette.cyan, palette.coral, palette.yellow];
    for (let i = 0; i < 3; i++) {
      const unit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.32, 0.9), bodyMat);
      unit.position.y = i * 0.4 - 0.4;
      g.add(unit);
      for (let j = 0; j < 3; j++) {
        const led = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 8, 8),
          new THREE.MeshStandardMaterial({ color: ledColors[(i + j) % ledColors.length], emissive: ledColors[(i + j) % ledColors.length], emissiveIntensity: 0.6 })
        );
        led.position.set(-0.5 + j * 0.16, i * 0.4 - 0.4, 0.46);
        g.add(led);
      }
    }
    return g;
  }

  function makeSmartphone() {
    const g = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 1.45, 0.1),
      new THREE.MeshStandardMaterial({ color: palette.light, roughness: 0.35, metalness: 0.25 })
    );
    g.add(frame);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.62, 1.22),
      new THREE.MeshBasicMaterial({ map: screenTexture })
    );
    screen.position.z = 0.052;
    g.add(screen);
    return g;
  }

  function makeWifiRingsAlt() {
    const g = makeWifiRings();
    g.rotation.z = Math.PI;
    return g;
  }

  /* -----------------------------------------------------------
     Assemble the cluster — spread toward the edges/corners so
     shapes read clearly around the photo rather than behind it.
     ----------------------------------------------------------- */
  const builders = [
    { build: makeLaptop, pos: [1.6, 3.0, -1.6], scale: 1.0, rot: [0.12, -0.55, 0] },
    { build: makeChip, pos: [-3.5, -2.1, -2], scale: 1.0, rot: [0.5, 0.5, 0.1] },
    { build: makeBinaryCube, pos: [3.7, 2.6, -2.5], scale: 0.95, rot: [0.3, 0.6, 0.1] },
    { build: makeMug, pos: [3.8, -2.6, -1], scale: 1.1, rot: [0.05, 0.4, 0] },
    { build: makeFloppy, pos: [-3.7, 2.8, -2], scale: 0.95, rot: [0.1, 0.4, -0.05] },
    { build: makeWifiRings, pos: [-0.2, -3.4, -3], scale: 1.25, rot: [0, 0, 0] },
    { build: makeGear, pos: [-4.0, 0.3, -2.8], scale: 1.0, rot: [0.2, 0.3, 0] },
    { build: makeCodeBrackets, pos: [4.0, 0.2, -1.8], scale: 1.25, rot: [0.1, 0.15, 0] },
    { build: makeServerRack, pos: [3.4, -0.4, -3.5], scale: 0.85, rot: [0.15, -0.5, 0] },
    { build: makeSmartphone, pos: [-3.2, -3.0, -1.5], scale: 0.9, rot: [0.05, 0.35, -0.1] },
    { build: makeWifiRingsAlt, pos: [2.7, 3.5, -3], scale: 0.9, rot: [0, 0, 0] },
    { build: makeGear, pos: [0.6, -3.9, -3.5], scale: 0.7, rot: [0.2, -0.3, 0] },
  ];

  const shapes = [];
  builders.forEach((b, i) => {
    const obj = b.build();
    obj.position.set(...b.pos);
    obj.scale.setScalar(b.scale);
    const [rx, ry, rz] = b.rot;
    obj.rotation.set(rx + (Math.random() - 0.5) * 0.12, ry + (Math.random() - 0.5) * 0.12, rz);

    obj.userData = {
      baseY: obj.position.y,
      floatSpeed: 0.35 + Math.random() * 0.35,
      floatOffset: i * 1.3,
      rotSpeedY: (i % 2 === 0 ? 1 : -1) * (0.05 + Math.random() * 0.05),
    };

    scene.add(obj);
    shapes.push(obj);
  });

  /* -----------------------------------------------------------
     Sparkle particle field — small glowing dots drifting behind
     everything, to fill the scene out and add depth/movement.
     ----------------------------------------------------------- */
  const sparkleColors = [palette.cyan, palette.coral, palette.yellow, palette.violet, palette.light];
  const sparkles = [];
  const SPARKLE_COUNT = 36;
  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: sparkleColors[i % sparkleColors.length],
      transparent: true,
      opacity: 0.55 + Math.random() * 0.35,
    });
    const r = 0.035 + Math.random() * 0.05;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), mat);
    dot.position.set(
      (Math.random() - 0.5) * 11,
      (Math.random() - 0.5) * 11,
      -1 - Math.random() * 6
    );
    dot.userData = {
      baseY: dot.position.y,
      floatSpeed: 0.3 + Math.random() * 0.6,
      floatOffset: Math.random() * Math.PI * 2,
    };
    scene.add(dot);
    sparkles.push(dot);
  }

  /* -----------------------------------------------------------
     Mouse parallax (scoped to the visual panel only)
     ----------------------------------------------------------- */
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  container.addEventListener('pointermove', (e) => {
    const r = container.getBoundingClientRect();
    pointer.targetX = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.targetY = ((e.clientY - r.top) / r.height) * 2 - 1;
  });
  container.addEventListener('pointerleave', () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
  });

  /* ---- resize: always match the container, not the whole hero ---- */
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* ---- gentle scroll fade so it recedes as you read on ---- */
  let scrollFactor = 0;
  window.addEventListener('scroll', () => {
    const vh = window.innerHeight;
    scrollFactor = Math.min(window.scrollY / vh, 1.2);
  }, { passive: true });

  /* ---- animation loop ---- */
  const clock = new THREE.Clock();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    pointer.x += (pointer.targetX - pointer.x) * 0.05;
    pointer.y += (pointer.targetY - pointer.y) * 0.05;

    if (!reduceMotion) {
      shapes.forEach((obj) => {
        const d = obj.userData;
        obj.position.y = d.baseY + Math.sin(t * d.floatSpeed + d.floatOffset) * 0.28;
        obj.rotation.y += d.rotSpeedY * 0.02;
      });
      sparkles.forEach((dot) => {
        const d = dot.userData;
        dot.position.y = d.baseY + Math.sin(t * d.floatSpeed + d.floatOffset) * 0.4;
      });
    }

    scene.rotation.y = pointer.x * 0.35;
    scene.rotation.x = -pointer.y * 0.18;

    camera.position.y = 0.5 - scrollFactor * 1.4;
    renderer.domElement.style.opacity = Math.max(1 - scrollFactor * 1.3, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
