/* =========================================
   SWEET CRUMBS — JavaScript
   =========================================
   Hero: 3 snap-point scroll animation
   Layer 1 (Crust):      ezgif-frame-026 → ezgif-frame-066
   Layer 2 (Cheesecake): ezgif-frame-071 → ezgif-frame-106
   Layer 3 (Glaze):      ezgif-frame-111 → ezgif-frame-131
   ========================================= */

// ============================================
// 1. HERO SNAP ANIMATION
// ============================================
(function () {

  // ── DOM refs ──────────────────────────────
  const canvas       = document.getElementById('heroCanvas');
  const ctx          = canvas.getContext('2d');
  const wrapper      = document.getElementById('hero');
  const overlay      = document.getElementById('heroOverlay');
  const panelsWrap   = document.getElementById('layerPanelsWrap');
  const railLine     = document.getElementById('snapRailLine');
  const scrollHint   = document.getElementById('scrollIndicator');
  const introText    = document.getElementById('heroIntro');
  const dots         = document.querySelectorAll('.snap-dot');
  const panels       = document.querySelectorAll('.layer-panel');

  // ── Frame manifest (37 frames) ────────────
  const frames = [
    'images/herosection/ezgif-frame-001.png',
    'images/herosection/ezgif-frame-006.png',
    'images/herosection/ezgif-frame-011.png',
    'images/herosection/ezgif-frame-016.png',
    'images/herosection/ezgif-frame-021.png',
    'images/herosection/ezgif-frame-026.png',
    'images/herosection/ezgif-frame-031.png',
    'images/herosection/ezgif-frame-036.png',
    'images/herosection/ezgif-frame-041.png',
    'images/herosection/ezgif-frame-046.png',
    'images/herosection/ezgif-frame-051.png',
    'images/herosection/ezgif-frame-056.png',
    'images/herosection/ezgif-frame-061.png',
    'images/herosection/ezgif-frame-066.png',
    'images/herosection/ezgif-frame-071.png',
    'images/herosection/ezgif-frame-076.png',
    'images/herosection/ezgif-frame-081.png',
    'images/herosection/ezgif-frame-086.png',
    'images/herosection/ezgif-frame-091.png',
    'images/herosection/ezgif-frame-096.png',
    'images/herosection/ezgif-frame-101.png',
    'images/herosection/ezgif-frame-106.png',
    'images/herosection/ezgif-frame-111.png',
    'images/herosection/ezgif-frame-116.png',
    'images/herosection/ezgif-frame-121.png',
    'images/herosection/ezgif-frame-126.png',
    'images/herosection/ezgif-frame-131.png',
    'images/herosection/ezgif-frame-135.png',
    'images/herosection/ezgif-frame-141.png',
    'images/herosection/ezgif-frame-146.png',
    'images/herosection/ezgif-frame-151.png',
    'images/herosection/ezgif-frame-156.png',
    'images/herosection/ezgif-frame-161.png',
    'images/herosection/ezgif-frame-166.png',
    'images/herosection/ezgif-frame-171.png',
    'images/herosection/ezgif-frame-176.png',
    'images/herosection/ezgif-frame-179.png',
  ];
  const TOTAL = frames.length; // 37

  // ── Layer config ──────────────────────────
  // Each snap zone: which frame range & mood overlay colours
  const LAYERS = [
    {
      frameStart: 5,          // ezgif-frame-026.png
      frameEnd:   13,         // ezgif-frame-066.png
      snapFrame:  12,         // ezgif-frame-061.png
      // Warm amber / biscuit tone
      overlay: 'linear-gradient(120deg, rgba(12,9,5,0.85) 0%, rgba(20,13,5,0.3) 55%, rgba(15,11,5,0.5) 100%)',
    },
    {
      frameStart: 14,         // ezgif-frame-071.png
      frameEnd:   21,         // ezgif-frame-106.png
      snapFrame:  21,         // ezgif-frame-106.png
      overlay: 'linear-gradient(120deg, rgba(10,9,8,0.80) 0%, rgba(22,18,14,0.25) 55%, rgba(18,15,11,0.45) 100%)',
    },
    {
      frameStart: 22,         // ezgif-frame-111.png
      frameEnd:   26,         // ezgif-frame-131.png
      snapFrame:  26,         // ezgif-frame-131.png
      overlay: 'linear-gradient(120deg, rgba(8,7,12,0.82) 0%, rgba(14,11,20,0.28) 55%, rgba(12,10,18,0.52) 100%)',
    },
  ];

  // ── State ─────────────────────────────────
  const imgCache   = new Array(TOTAL);
  let   renderIdx  = 0;        // currently drawn frame index
  let   rafId      = null;
  let   snapIdx    = 0;        // which snap zone (0/1/2) we're in
  let   isSnapping = false;    // mid-programmatic scroll
  let   hasLayerActivated = false;

  // ── Canvas resize ─────────────────────────
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(renderIdx);
  }

  // ── Cover-fit draw ────────────────────────
  function renderFrame(idx) {
    const img = imgCache[idx];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale, sh = ih * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }

  // ── Smooth lerp to frame ──────────────────
  let lerpTarget = 0;
  let lerpCurrent = 0;

  function lerpTick() {
    const diff = lerpTarget - lerpCurrent;
    if (Math.abs(diff) < 0.3) {
      lerpCurrent = lerpTarget;
      const i = Math.round(Math.max(0, Math.min(TOTAL - 1, lerpCurrent)));
      renderFrame(i);
      renderIdx = i;
      rafId = null;
      return;
    }
    lerpCurrent += diff * 0.14;
    const i = Math.round(Math.max(0, Math.min(TOTAL - 1, lerpCurrent)));
    renderFrame(i);
    renderIdx = i;
    rafId = requestAnimationFrame(lerpTick);
  }

  function setTargetFrame(target) {
    lerpTarget = Math.max(0, Math.min(TOTAL - 1, target));
    if (!rafId) rafId = requestAnimationFrame(lerpTick);
  }

  // ── Preload ───────────────────────────────
  function preload() {
    // Frame 0 first for instant paint
    const f0 = new Image();
    f0.onload = () => { imgCache[0] = f0; renderFrame(0); };
    f0.src = frames[0];
    imgCache[0] = f0;

    for (let i = 1; i < TOTAL; i++) {
      (function (i) {
        const img = new Image();
        img.onload = () => { imgCache[i] = img; };
        img.src = frames[i];
        imgCache[i] = img;
      })(i);
    }
  }

  // ── Snap zone helpers ─────────────────────
  // wrapper.offsetHeight = 400vh; scrollable inside hero = 300vh
  function getHeroRelScroll() {
    return Math.max(0, window.scrollY - wrapper.offsetTop);
  }

  function getWrapperScrollable() {
    return wrapper.offsetHeight - window.innerHeight; // 300vh
  }

  // Which snap index is nearest to relScroll?
  function nearestSnapIdx(relScroll) {
    const vh   = window.innerHeight;
    const dists = [0, vh, 2 * vh].map(sp => Math.abs(relScroll - sp));
    return dists.indexOf(Math.min(...dists));
  }

  // relScroll → frame index
  function scrollToFrame(relScroll) {
    const maxScroll = getWrapperScrollable();
    const progress  = Math.max(0, Math.min(1, relScroll / maxScroll));
    return progress * (TOTAL - 1);
  }

  // ── Panel / dot / rail updates ────────────
  function clearActiveLayer() {
    panels.forEach((p) => p.classList.remove('active'));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === 0);
      d.classList.remove('done');
    });
    railLine.style.setProperty('--fill', '0%');
  }

  function setActiveLayer(idx) {
    if (idx === snapIdx && panelsWrap.querySelector('.layer-panel.active')) return (snapIdx = idx);
    snapIdx = idx;
    hasLayerActivated = true;

    // Panels
    panels.forEach((p, i) => p.classList.toggle('active', i === idx));

    // Dots
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.classList.toggle('done',   i < idx);
    });

    // Rail fill (0 → 0%, 1 → 50%, 2 → 100%)
    railLine.style.setProperty('--fill', (idx / (dots.length - 1) * 100) + '%');

    // Overlay mood shift
    if (overlay) overlay.style.background = LAYERS[idx].overlay;
  }

  // ── Programmatic snap scroll ──────────────
  function snapTo(idx) {
    const vh       = window.innerHeight;
    const heroTop  = wrapper.offsetTop;
    const targets  = [0, vh, 2 * vh];
    const absTarget = heroTop + targets[idx];

    if (Math.abs(window.scrollY - absTarget) < 4) {
      setActiveLayer(idx);
      setTargetFrame(LAYERS[idx].snapFrame);
      return;
    }

    isSnapping = true;
    window.scrollTo({ top: absTarget, behavior: 'smooth' });

    // Release flag once scroll settles
    let releaseId = null;
    function onSnapScroll() {
      clearTimeout(releaseId);
      releaseId = setTimeout(() => {
        isSnapping = false;
        window.removeEventListener('scroll', onSnapScroll);
        setActiveLayer(idx);
        setTargetFrame(LAYERS[idx].snapFrame);
      }, 180);
    }
    window.addEventListener('scroll', onSnapScroll, { passive: true });
  }

  // ── Main scroll handler ───────────────────
  function onScroll() {
    const relScroll  = getHeroRelScroll();
    const liveFrame  = scrollToFrame(relScroll);

    // Drive frame
    setTargetFrame(liveFrame);

    // Fade scroll hint
    scrollHint.style.opacity = relScroll > 40 ? '0' : '1';
    if (introText) {
      const introFadeProgress = Math.max(0, Math.min(1, relScroll / 260));
      introText.style.opacity = String(1 - introFadeProgress);
      introText.style.transform = `translate(-50%, calc(-50% - ${introFadeProgress * 12}px))`;
    }

    // Determine which zone we're in (for live panel preview while scrolling)
    const vh = window.innerHeight;
    if (liveFrame < LAYERS[0].frameStart) {
      if (hasLayerActivated) {
        clearActiveLayer();
        hasLayerActivated = false;
      }
    } else {
      let liveIdx;
      if      (liveFrame <= LAYERS[0].frameEnd) liveIdx = 0;
      else if (liveFrame <= LAYERS[1].frameEnd) liveIdx = 1;
      else                                      liveIdx = 2;
      setActiveLayer(liveIdx);
    }

    // Keep free smooth scrolling for wheel/touch gestures.
    // Snap is still available when user clicks the right-side dots.
    if (isSnapping) return;
  }

  // ── Dot click navigation ──────────────────
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.snap, 10);
      snapTo(idx);
    });
  });

  // ── Init ─────────────────────────────────
  resizeCanvas();
  preload();
  clearActiveLayer();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { resizeCanvas(); snapTo(snapIdx); });
  onScroll();

})();


// ============================================
// 2. NAVBAR — scroll state & mobile menu
// ============================================
(function () {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const navLinks = document.getElementById('navLinks');

  function setNavOpen(open) {
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    setNavOpen(!navLinks.classList.contains('open'));
  });

  if (navClose) {
    navClose.addEventListener('click', () => setNavOpen(false));
  }

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setNavOpen(false));
  });
})();


// ============================================
// 3. TESTIMONIALS CAROUSEL
// ============================================
(function () {
  const track   = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  if (!track) return;

  let index = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;

  function getVisible() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  function update() {
    const visible  = getVisible();
    const maxIndex = Math.max(0, total - visible);
    index = Math.max(0, Math.min(index, maxIndex));
    const cardW = cards[0].offsetWidth;
    const gap   = 24; // 1.5rem
    track.style.transform = `translateX(-${index * (cardW + gap)}px)`;
  }

  prevBtn.addEventListener('click', () => { index--; update(); });
  nextBtn.addEventListener('click', () => { index++; update(); });
  window.addEventListener('resize', update);
  update();
})();


// ============================================
// 4. STATS COUNTER (Intersection Observer)
// ============================================
(function () {
  const nums = document.querySelectorAll('.stat-number');

  function countUp(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4); // ease-out quart
      el.textContent = Math.round(e * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { countUp(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  nums.forEach(el => obs.observe(el));
})();


// ============================================
// 5. FADE-UP ENTRIES (Intersection Observer)
// ============================================
(function () {
  const targets = document.querySelectorAll(
    '.specialty-card, .gallery-item, .process-step, .testimonial-card, .section-header, .stat-item'
  );

  targets.forEach(el => {
    el.style.opacity  = '0';
    el.style.transform = 'translateY(36px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 60 * (parseInt(entry.target.dataset.delay || 0)));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  targets.forEach((el, i) => {
    el.dataset.delay = i % 5;
    obs.observe(el);
  });
})();


// ============================================
// 6. ORDER FORM — validation & submit feedback
// ============================================
(function () {
  const form      = document.getElementById('orderForm');
  const submitBtn = document.getElementById('submitOrder');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.fullName.value.trim();
    const email = form.email.value.trim();

    if (!name || !email) {
      submitBtn.textContent = 'Please fill in required fields';
      submitBtn.style.background = '#b03a2e';
      setTimeout(() => {
        submitBtn.textContent  = 'Send My Request';
        submitBtn.style.background = '';
      }, 2500);
      return;
    }

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      submitBtn.textContent        = '✓ Request Sent!';
      submitBtn.style.background   = '#1e8449';
      submitBtn.style.color        = '#fff';
      form.reset();
      setTimeout(() => {
        submitBtn.textContent      = 'Send My Request';
        submitBtn.style.background = '';
        submitBtn.style.color      = '';
        submitBtn.disabled         = false;
      }, 3000);
    }, 1400);
  });
})();
