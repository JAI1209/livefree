/* Property page — room pagination (3 per page) & room details */
(function () {
  function goToSection(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('.btn-check-rates-outline, .btn-room-price').forEach((button) => {
    button.addEventListener('click', () => goToSection('#booking'));
  });

  document.querySelectorAll('.btn-view-all-photos').forEach((button) => {
    button.addEventListener('click', () => goToSection('.property-photos'));
  });

  const ROOMS_PER_PAGE = 3;
  const cards = Array.from(document.querySelectorAll('.room-type-card[data-room]'));
  const dotsContainer = document.getElementById('roomPaginationDots');
  const showMoreBtn = document.getElementById('roomShowMore');

  if (!cards.length) return;

  const totalPages = Math.ceil(cards.length / ROOMS_PER_PAGE);
  let currentPage = 0;

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'room-page-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Room page ${i + 1} of ${totalPages}`);
      dot.setAttribute('aria-selected', i === currentPage ? 'true' : 'false');
      if (i === currentPage) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToPage(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.room-page-dot').forEach((dot, i) => {
      const active = i === currentPage;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function goToPage(page) {
    currentPage = Math.max(0, Math.min(page, totalPages - 1));
    cards.forEach((card, index) => {
      const cardPage = Math.floor(index / ROOMS_PER_PAGE);
      const visible = cardPage === currentPage;
      card.classList.toggle('room-type-card--hidden', !visible);
      card.hidden = !visible;
    });
    updateDots();
    if (showMoreBtn) {
      const onLast = currentPage >= totalPages - 1;
      showMoreBtn.hidden = onLast;
      showMoreBtn.disabled = onLast;
    }
    const list = document.getElementById('roomTypesList');
    if (list) list.setAttribute('data-page', String(currentPage + 1));
  }

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      if (currentPage < totalPages - 1) goToPage(currentPage + 1);
    });
  }

  buildDots();
  goToPage(0);

  document.querySelectorAll('.room-details-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.room-type-card');
      const panel = card && card.querySelector('.room-details-panel');
      if (!panel) return;
      const open = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
