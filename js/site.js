/* =========================================================
   PicoSoft-Exsel — comportamiento del sitio
   HTML5 + JavaScript (ES2020), sin dependencias externas:
   fondo de partículas, contadores, reveal, lightbox,
   copiado al portapapeles y botón de retorno.
   ========================================================= */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. Fondo de partículas (constelación) del hero
     --------------------------------------------------------- */
  const canvas = document.getElementById('particles');
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d', { alpha: true });
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, dots = [], raf = 0, running = true;

    const density = () => {
      const area = w * h;
      return Math.max(36, Math.min(120, Math.round(area / 16000)));
    };

    const make = () => {
      dots = Array.from({ length: density() }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.7 + 0.7,
        hue: Math.random() > 0.72 ? '6,182,212' : '129,140,248'
      }));
    };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      w = box.width; h = box.height;
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      make();
    };

    const LINK = 130;          // distancia de enlace
    const LINK2 = LINK * LINK;

    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < -20) d.x = w + 20; else if (d.x > w + 20) d.x = -20;
        if (d.y < -20) d.y = h + 20; else if (d.y > h + 20) d.y = -20;
      }

      // enlaces
      ctx.lineWidth = 0.7;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            ctx.strokeStyle = `rgba(148,163,255,${(1 - d2 / LINK2) * 0.30})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // puntos
      for (const d of dots) {
        ctx.fillStyle = `rgba(${d.hue},.72)`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    let t = 0;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(resize, 180);
    }, { passive: true });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    resize();
    raf = requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     2. Navbar con fondo al hacer scroll
     --------------------------------------------------------- */
  const pnav = document.getElementById('pnav');
  const totop = document.getElementById('totop');
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (pnav) pnav.classList.toggle('scrolled', y > 24);
    if (totop) totop.classList.toggle('show', y > 640);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (totop) {
    totop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  }

  /* ---------------------------------------------------------
     3. Reveal on scroll
     --------------------------------------------------------- */
  const revealables = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------
     4. Contadores animados
     --------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = Number(el.dataset.count) || 0;
    if (reduced) { el.textContent = String(target); return; }
    const dur = 1400;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.count; });
  }

  /* ---------------------------------------------------------
     5. Lightbox de la galería (modal de Bootstrap 5)
     --------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox && window.bootstrap) {
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCap');
    document.querySelectorAll('.gshot').forEach(btn => {
      btn.addEventListener('click', () => {
        const full = btn.dataset.full;
        const caption = btn.dataset.caption || '';
        if (img && full) { img.src = full; img.alt = caption; }
        if (cap) cap.textContent = caption;
      });
    });
  }

  /* ---------------------------------------------------------
     6. Copiar comandos
     --------------------------------------------------------- */
  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  };

  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const src = document.getElementById(btn.dataset.copy || '');
      if (!src) return;
      try {
        await copyText(src.innerText.trim());
        const prev = btn.textContent;
        btn.textContent = '¡Copiado!';
        btn.classList.add('done');
        setTimeout(() => { btn.textContent = prev; btn.classList.remove('done'); }, 1600);
      } catch (_) {
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = 'Copiar'; }, 1600);
      }
    });
  });

  /* ---------------------------------------------------------
     7. Año del pie de página
     --------------------------------------------------------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
