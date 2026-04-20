/* =========================================================
   KAPESO INVESTMENTS LIMITED — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL ── */
  const nav = document.querySelector('nav');
  const backTop = document.querySelector('.back-top');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    backTop.classList.toggle('show', window.scrollY > 400);
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── HAMBURGER / MOBILE NAV ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn  = document.querySelector('.mobile-nav .close-btn');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  const closeMobileNav = () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeMobileNav);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

  /* ── REVEAL ON SCROLL ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.product-card, .feature-item, .testimonial-card, .about-img-wrap, ' +
    '.about-text, .gallery-item, .gallery-placeholder, .stat-item, ' +
    '.worker-card, .contact-info, .contact-form'
  ).forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  /* ── COUNTER ANIMATION ── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(n => counterObs.observe(n));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  /* ── GALLERY TAB FILTER ── */
  const tabs = document.querySelectorAll('.gallery-tab');
  const items = document.querySelectorAll('.gallery-item, .gallery-placeholder');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
        if (show) {
          item.style.animation = 'none';
          item.offsetHeight; // reflow
          item.style.animation = 'zoomIn 0.4s ease';
        }
      });
    });
  });

  /* ── LIGHTBOX ── */
  const lightbox    = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCap = lightbox.querySelector('.lightbox-caption');
  const closeLight  = lightbox.querySelector('.lightbox-close');
  const prevBtn     = lightbox.querySelector('.lightbox-prev');
  const nextBtn     = lightbox.querySelector('.lightbox-next');

  let currentImages = [];
  let currentIndex  = 0;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const activeFilter = document.querySelector('.gallery-tab.active').dataset.filter;
      const visibleItems = [...document.querySelectorAll('.gallery-item')].filter(
        i => activeFilter === 'all' || i.dataset.category === activeFilter
      );
      currentImages = visibleItems.map(i => ({
        src: i.querySelector('img').src,
        caption: i.querySelector('.gallery-item-overlay span')?.textContent || ''
      }));
      currentIndex = visibleItems.indexOf(item);
      openLightbox();
    });
  });

  function openLightbox() {
    lightboxImg.src = currentImages[currentIndex].src;
    lightboxCap.textContent = currentImages[currentIndex].caption +
      ` (${currentIndex + 1} / ${currentImages.length})`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeLight.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    openLightbox();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    openLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  /* ── CONTACT FORM ── */
  const form = document.querySelector('.contact-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Simulate async send (replace with real fetch/emailjs)
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'var(--green-dark)';
      form.reset();

      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });

  /* ── SMOOTH HERO PARALLAX ── */
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      hero.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.35}px)`;
    }
  }, { passive: true });

});
