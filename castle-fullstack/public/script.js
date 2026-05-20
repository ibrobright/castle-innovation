/* ===================================================
   CASTLE INNOVATIONS LTD — script.js
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== PAGE LOADER =====
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1600);
  });

  // ===== STICKY NAVBAR =====
  const nav = document.getElementById('mainNav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 300);
    highlightActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== SCROLL TO TOP =====
  document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav if open
        const collapse = document.getElementById('navbarNav');
        if (collapse.classList.contains('show')) {
          new bootstrap.Collapse(collapse).hide();
        }
      }
    });
  });

  // ===== ACTIVE NAV HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function highlightActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active-link'));
        const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (active) active.classList.add('active-link');
      }
    });
  }

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger children
        entry.target.style.transitionDelay = `${i * 0.05}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObserver.observe(el));

  // ===== ANIMATED COUNTERS =====
  const counters = document.querySelectorAll('.counter');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObserver.observe(c));

  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  }

  // ===== PROJECT FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.style.transition = 'opacity .3s, transform .3s';
        if (match) {
          item.style.opacity = '0';
          item.classList.remove('hidden');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => { item.style.opacity = '1'; });
          });
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.classList.add('hidden'), 300);
        }
      });
    });
  });

  // ===== TESTIMONIAL SLIDER =====
  const slides = document.querySelectorAll('.tslide');
  const dotsContainer = document.getElementById('tDots');
  let currentSlide = 0;
  let sliderInterval;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `tdot${i === 0 ? ' active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.tdot')[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.tdot')[currentSlide].classList.add('active');
  }

  function startSlider() {
    sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  function stopSlider() { clearInterval(sliderInterval); }

  document.getElementById('tNext').addEventListener('click', () => { goToSlide(currentSlide + 1); stopSlider(); startSlider(); });
  document.getElementById('tPrev').addEventListener('click', () => { goToSlide(currentSlide - 1); stopSlider(); startSlider(); });
  startSlider();

  // Pause on hover
  const slider = document.getElementById('testimonialSlider');
  slider.addEventListener('mouseenter', stopSlider);
  slider.addEventListener('mouseleave', startSlider);

  // ===== DARK / LIGHT MODE =====
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('castle-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  updateToggleIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('castle-theme', next);
    updateToggleIcon(next);
  });

  function updateToggleIcon(theme) {
    themeToggle.innerHTML = theme === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }

  // ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Sending...';

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        btn.innerHTML = '<i class="fa-solid fa-circle-check me-2"></i>Message Sent!';
        btn.style.background = '#16a34a';
        btn.style.borderColor = '#16a34a';
        form.reset();
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-2"></i>Error!';
      btn.style.background = '#dc2626';
      btn.style.borderColor = '#dc2626';
      console.error('Form error:', err);
    }

    // Reset button after 3 seconds
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 3000);
  });
}
  // ===== NAVBAR TOGGLER ICON ANIMATION =====
  const toggler = document.querySelector('.navbar-toggler');
  const navCollapse = document.getElementById('navbarNav');
  navCollapse.addEventListener('show.bs.collapse', () => {
    toggler.innerHTML = '<span style="font-size:1.2rem;color:var(--blue-elec)">✕</span>';
  });
  navCollapse.addEventListener('hide.bs.collapse', () => {
    toggler.innerHTML = '<span class="navbar-toggler-icon"></span>';
  });

  // ===== HERO PARALLAX =====
  window.addEventListener('scroll', () => {
    const heroOverlay = document.querySelector('.hero-overlay');
    if (heroOverlay && window.scrollY < window.innerHeight) {
      heroOverlay.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  }, { passive: true });

  // ===== HERO CARD MOUSE TILT =====
  const heroCardStack = document.querySelector('.hero-card-stack');
  if (heroCardStack) {
    heroCardStack.addEventListener('mousemove', e => {
      const rect = heroCardStack.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      heroCardStack.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
    });
    heroCardStack.addEventListener('mouseleave', () => {
      heroCardStack.style.transform = '';
      heroCardStack.style.transition = 'transform .5s ease';
    });
  }

  // ===== PROJECT CARD HOVER GLOW =====
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });

});
