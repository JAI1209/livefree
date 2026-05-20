/* ── Social carousel ── */
const socialGrid = document.getElementById('socialGrid');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
if (socialGrid && prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => socialGrid.scrollBy({ left: -300, behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => socialGrid.scrollBy({ left: 300, behavior: 'smooth' }));
}

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const menuToggle = document.getElementById('menu-toggle');
      if (menuToggle && menuToggle.checked) menuToggle.checked = false;
    }
  });
});

/* ── Logo fallback ── */
const logoImg = document.querySelector('.logo-img');
if (logoImg && logoImg.complete && logoImg.naturalWidth === 0) {
  logoImg.src = 'https://placehold.co/600x200/e85d3a/white?text=LiveFree';
}

/* ── Properties Dropdown ── */
const propTrigger = document.getElementById('propTrigger');
const propMenu = document.getElementById('propMenu');
const propLabel = document.getElementById('propLabel');
const propWrap = propTrigger ? propTrigger.closest('.prop-dropdown-wrap') : null;

let aboutCloseTimer;
let propCloseTimer;
let aboutOpenTimer;
let propOpenTimer;
const DROPDOWN_OPEN_DELAY = 80;
const DROPDOWN_CLOSE_DELAY = 160;

function setPropMenu(open) {
  if (!propTrigger || !propMenu) return;
  propMenu.classList.toggle('prop-open', open);
  propTrigger.classList.toggle('prop-open', open);
  propTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
}

if (propTrigger && propMenu) {
  propTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    clearTimeout(propOpenTimer);
    clearTimeout(propCloseTimer);
    const isOpen = !propMenu.classList.contains('prop-open');
    setAboutMenu(false);
    setPropMenu(isOpen);
  });

  if (propWrap) {
    propWrap.addEventListener('mouseenter', () => {
      clearTimeout(propOpenTimer);
      clearTimeout(propCloseTimer);
      propOpenTimer = setTimeout(() => {
        setAboutMenu(false);
        setPropMenu(true);
      }, DROPDOWN_OPEN_DELAY);
    });
    propWrap.addEventListener('mouseleave', () => {
      clearTimeout(propOpenTimer);
      propCloseTimer = setTimeout(() => setPropMenu(false), DROPDOWN_CLOSE_DELAY);
    });
  }

  document.querySelectorAll('.prop-option').forEach(opt => {
    opt.addEventListener('click', () => {
      if (propLabel && opt.dataset.label) propLabel.textContent = opt.dataset.label;
      setPropMenu(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!propTrigger.contains(e.target) && !propMenu.contains(e.target)) {
      setPropMenu(false);
    }
  });
}

/* ── About Dropdown (click to toggle) ── */
const aboutWrap = document.querySelector('.about-dropdown-wrap');
const aboutTrigger = document.querySelector('.about-dropdown-trigger');
const aboutMenu = aboutWrap
  ? aboutWrap.querySelector('.about-dropdown, .about-dropdown-menu')
  : null;

function setAboutMenu(open) {
  if (!aboutWrap || !aboutTrigger) return;
  aboutWrap.classList.toggle('about-open', open);
  aboutTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
}

if (aboutWrap && aboutTrigger && aboutMenu) {
  const closeAboutMenu = () => {
    setAboutMenu(false);
  };

  aboutTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(aboutOpenTimer);
    clearTimeout(aboutCloseTimer);
    const isOpen = !aboutWrap.classList.contains('about-open');
    setPropMenu(false);
    setAboutMenu(isOpen);
  });

  aboutWrap.addEventListener('mouseenter', () => {
    clearTimeout(aboutOpenTimer);
    clearTimeout(aboutCloseTimer);
    aboutOpenTimer = setTimeout(() => {
      setPropMenu(false);
      setAboutMenu(true);
    }, DROPDOWN_OPEN_DELAY);
  });

  aboutWrap.addEventListener('mouseleave', () => {
    clearTimeout(aboutOpenTimer);
    aboutCloseTimer = setTimeout(closeAboutMenu, DROPDOWN_CLOSE_DELAY);
  });

  aboutMenu.querySelectorAll('a').forEach(option => {
    option.addEventListener('click', (e) => {
      clearTimeout(aboutOpenTimer);
      clearTimeout(aboutCloseTimer);
      const optionUrl = new URL(option.getAttribute('href'), window.location.href);
      const isCurrentPage =
        optionUrl.pathname === window.location.pathname &&
        optionUrl.search === window.location.search &&
        optionUrl.hash === window.location.hash;
      if (isCurrentPage) e.preventDefault();
      closeAboutMenu();
      aboutTrigger.blur();
      option.blur();
    });
  });

  document.addEventListener('click', (e) => {
    if (!aboutWrap.contains(e.target)) {
      closeAboutMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAboutMenu();
    }
  });
}

/* ── Properties Dropdown Wave Animation ── */
(function () {
  const canvas = document.getElementById('propWaveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let tick = 0;

  function resize() {
    const menu = document.getElementById('propMenu');
    if (!menu) return;
    const r = menu.getBoundingClientRect();
    if (r.width > 10 && r.height > 10) {
      canvas.width  = r.width;
      canvas.height = r.height;
    }
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    if (W <= 10 || H <= 10) return;
    ctx.clearRect(0, 0, W, H);

    const cities = 3;
    const headerH = 52;
    const rowH = (H - headerH) / cities;

    for (let cityIdx = 0; cityIdx < cities; cityIdx++) {
      const offset = cityIdx * (Math.PI * 2 / cities);
      const waveX = ((tick * 1.8 + cityIdx * 120) % (W + 200)) - 100;
      const alpha = 0.6 + 0.4 * Math.sin(tick * 0.03 + offset);
      const yStart = headerH + cityIdx * rowH;

      for (let lane = 0; lane < 3; lane++) {
        const yOff  = yStart + rowH * 0.25 + lane * (rowH * 0.22);
        const amp   = 3 + lane * 1.5;
        const freq  = 0.03 + lane * 0.007;
        const phase = lane * 1.3 + offset;
        const lg = ctx.createLinearGradient(waveX - 80, 0, waveX + 80, 0);
        lg.addColorStop(0,    'rgba(255,160,80,0)');
        lg.addColorStop(0.35, `rgba(255,180,80,${alpha * 0.4})`);
        lg.addColorStop(0.5,  `rgba(255,220,120,${alpha * 0.75})`);
        lg.addColorStop(0.65, `rgba(255,180,80,${alpha * 0.4})`);
        lg.addColorStop(1,    'rgba(255,160,80,0)');
        ctx.beginPath();
        ctx.strokeStyle = lg;
        ctx.lineWidth = lane === 1 ? 2 : 1.3;
        for (let x = 0; x <= W; x += 2) {
          const local = Math.max(0, 1 - Math.pow(Math.abs(x - waveX) / 80, 2));
          const y = yOff + Math.sin(x * freq + tick * 0.06 + phase) * amp * local;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  }

  function loop() {
    tick++;
    const menu = document.getElementById('propMenu');
    if (menu && menu.classList.contains('prop-open')) {
      resize();
      draw();
    } else {
      if (canvas.width > 0) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(loop);
  }

  loop();
})();
