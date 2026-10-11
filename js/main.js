(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Saber colour theme (remembered when storage is available) */
  function setSaber(c) {
    root.setAttribute('data-saber', c);
    document.querySelectorAll('.saber').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.saber === c); });
    try { localStorage.setItem('saber', c); } catch (e) {}
  }
  var saved = 'blue';
  try { saved = localStorage.getItem('saber') || 'blue'; } catch (e) {}
  setSaber(saved);
  document.querySelectorAll('.saber').forEach(function (b) {
    b.addEventListener('click', function () { setSaber(b.dataset.saber); });
  });

  /* Mobile menu + header state */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', root.classList.toggle('nav-open'));
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { root.classList.remove('nav-open'); });
    });
  }
  function onScroll() { header && header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Starfield */
  var canvas = document.getElementById('stars');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d'), stars = [], w, h, mx = 0, my = 0, tx = 0, ty = 0;
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr; h = canvas.height = innerHeight * dpr;
      stars = [];
      var n = Math.round((innerWidth * innerHeight) / (innerWidth < 700 ? 7000 : 4500));
      for (var i = 0; i < n; i++) {
        var z = Math.random();
        stars.push({ x: Math.random() * w, y: Math.random() * h, z: z, r: (0.4 + z * 1.4) * dpr, tw: Math.random() * 6.28 });
      }
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduced) { s.y -= 0.06 + s.z * 0.28; if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; } }
        var x = s.x + mx * s.z * 40, y = s.y + my * s.z * 40;
        var a = 0.35 + 0.65 * Math.abs(Math.sin(t / 1400 + s.tw));
        ctx.globalAlpha = a * (0.4 + s.z * 0.6);
        ctx.fillStyle = s.z > 0.8 ? '#cfe3ff' : '#ffffff';
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
      }
      if (!reduced) requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; });
    requestAnimationFrame(draw);
  }

  /* Contact form (demo: nothing is sent to a server) */
  var form = document.querySelector('form.form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      note.textContent = 'Transmisión recibida. (Demo: este formulario no envía datos a ningún servidor.)';
      if (window.gsap) gsap.fromTo(note, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 });
      form.reset();
    });
  }

  /* GSAP animations — if it is missing, everything stays visible */
  if (!window.gsap || reduced) { root.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* Hero intro */
  if (document.querySelector('.hero-logo')) {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero .kicker', { opacity: 0, y: 20, duration: 1, delay: 0.2 })
      .from('.hero-logo', { opacity: 0, scale: 1.5, filter: 'blur(14px)', duration: 1.8, ease: 'power4.out' }, 0.5)
      .from('.hero-saber', { scaleX: 0, duration: 1.1, ease: 'power2.inOut' }, 1.5)
      .from('.hero p.lead', { opacity: 0, y: 24, duration: 0.9 }, 1.9)
      .from('.hero-cta .btn', { opacity: 0, y: 24, duration: 0.7, stagger: 0.14 }, 2.1);
    gsap.to('.hero-saber', { opacity: 0.55, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 });
    gsap.to('.hero-bg', { yPercent: 14, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-inner', { yPercent: -12, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true } });
  }

  /* Pinned opening crawl driven by scroll */
  var crawl = document.querySelector('.crawl');
  if (crawl) {
    gsap.set('.crawl-text', { rotationX: 28, transformOrigin: '50% 100%', yPercent: 85 });
    gsap.to('.crawl-text', {
      yPercent: -135, ease: 'none',
      scrollTrigger: { trigger: crawl, start: 'top top', end: '+=1700', pin: true, scrub: 0.8 }
    });
    gsap.to('.crawl-hint', { opacity: 0, scrollTrigger: { trigger: crawl, start: 'top top', end: '+=300', scrub: true } });
  }

  /* Sub page hero */
  if (document.querySelector('.page-hero')) {
    gsap.from('.page-hero h1, .page-hero p, .page-hero .eyebrow', { y: 40, opacity: 0, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 0.15 });
  }

  /* Generic reveals */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  gsap.utils.toArray('[data-stagger]').forEach(function (group) {
    var items = group.children;
    gsap.set(items, { opacity: 0, y: 60 });
    ScrollTrigger.create({ trigger: group, start: 'top 88%', once: true, onEnter: function () {
      gsap.to(items, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
    } });
  });

  /* Story sections: image slides in and floats, text follows */
  gsap.utils.toArray('.story').forEach(function (s) {
    var img = s.querySelector('.story-img img'), flip = s.classList.contains('flip');
    var st = { trigger: s, start: 'top 75%', once: true };
    gsap.from(img, { x: flip ? 120 : -120, opacity: 0, rotate: flip ? 6 : -6, duration: 1.3, ease: 'power3.out', scrollTrigger: st });
    gsap.from(s.querySelectorAll('.story-text > *'), { y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: st });
    gsap.to(img, { y: -40, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Band image */
  var bandImg = document.querySelector('.band img');
  if (bandImg) gsap.to(bandImg, { y: -30, rotate: 2, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* Gallery: filters + 3D tilt */
  var cards = gsap.utils.toArray('.char');
  if (cards.length) {
    var buttons = document.querySelectorAll('.filter');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
        var f = btn.dataset.filter;
        var show = cards.filter(function (c) { return f === 'all' || c.dataset.side === f; });
        var hide = cards.filter(function (c) { return show.indexOf(c) < 0; });
        gsap.to(hide, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: function () {
          hide.forEach(function (c) { c.style.display = 'none'; });
          show.forEach(function (c) { c.style.display = ''; });
          gsap.fromTo(show, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out' });
        } });
      });
    });
    if (window.matchMedia('(hover: hover)').matches) {
      cards.forEach(function (c) {
        c.addEventListener('mousemove', function (e) {
          var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(c, { rotateY: px * 12, rotateX: -py * 12, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
        });
        c.addEventListener('mouseleave', function () { gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1,0.6)' }); });
      });
    }
  }

  /* Magnetic buttons */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.16, y: (e.clientY - r.top - r.height / 2) * 0.22, duration: 0.3 });
      });
      btn.addEventListener('mouseleave', function () { gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }); });
    });
  }
})();
