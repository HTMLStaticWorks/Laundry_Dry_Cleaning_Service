/* ==========================================================================
   FreshFlow Laundry & Dry Cleaning - Main JavaScript Engine
   Includes: Three.js 3D Hero Scene, Canvas Bubbles Generator, GSAP Animations,
   Lenis Smooth Scroll, Mobile Drawer Toggle & Interactive Laundry Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavbarScroll();
  initMobileDrawer();
  // initBubblesCanvas(); // Disabled as requested
  initThreeJSHero();
  initGSAPAnimations();
  initCounters();
  initLaundryInteractions();
  initThemeAndRTL();
  initPasswordToggles();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. PAGE LOADER
   -------------------------------------------------------------------------- */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      document.body.classList.add('loaded');
    }, 1000);
  }
}

/* --------------------------------------------------------------------------
   2. NAVBAR SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.fresh-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   3. MOBILE OFF-CANVAS DRAWER
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-drawer-toggle');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const menuLinks = document.querySelectorAll('.mobile-menu-link');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  menuLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   4. CANVASES - FLOATING SOAP BUBBLES BACKGROUND (DISABLED)
   -------------------------------------------------------------------------- */
function initBubblesCanvas() {
  // Unwanted bubble particle effect disabled globally
}

/* --------------------------------------------------------------------------
   5. THREE.JS INTERACTIVE 3D HERO CANVAS
   -------------------------------------------------------------------------- */
function initThreeJSHero() {
  const container = document.getElementById('hero-3d-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Outer Washing Drum Ring
  const drumGroup = new THREE.Group();

  const outerGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.2, 32, 1, true);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0x0EA5E9,
    metalness: 0.8,
    roughness: 0.2,
    wireframe: false,
    side: THREE.DoubleSide
  });
  const outerDrum = new THREE.Mesh(outerGeo, outerMat);
  outerDrum.rotation.x = Math.PI / 2;
  drumGroup.add(outerDrum);

  // Inner Perforated Glass Drum Window
  const innerGeo = new THREE.TorusGeometry(1.4, 0.2, 16, 100);
  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0x38BDF8,
    transmission: 0.9,
    opacity: 1,
    transparent: true,
    roughness: 0.1,
    ior: 1.5
  });
  const innerWindow = new THREE.Mesh(innerGeo, innerMat);
  drumGroup.add(innerWindow);

  scene.add(drumGroup);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x38BDF8, 2);
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x10B981, 1.5);
  dirLight2.position.set(-5, -5, 2);
  scene.add(dirLight2);

  // Mouse Parallax Interaction
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
  });

  // Render Loop
  function renderScene() {
    requestAnimationFrame(renderScene);

    drumGroup.rotation.z += 0.008;

    drumGroup.rotation.x += (mouseY - drumGroup.rotation.x) * 0.05;
    drumGroup.rotation.y += (mouseX - drumGroup.rotation.y) * 0.05;

    renderer.render(scene, camera);
  }

  renderScene();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* --------------------------------------------------------------------------
   6. GSAP ANIMATIONS & SCROLL TRIGGER
   -------------------------------------------------------------------------- */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  gsap.utils.toArray('.gsap-fade-up').forEach(elem => {
    gsap.from(elem, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elem,
        start: 'top 85%'
      }
    });
  });

  const cards = document.querySelectorAll('.gsap-stagger-card');
  if (cards.length > 0) {
    gsap.from(cards, {
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards[0].parentElement,
        start: 'top 80%'
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. NUMERIC COUNTERS
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;

  let animated = false;
  window.addEventListener('scroll', () => {
    const section = counters[0].closest('section');
    if (!section || animated) return;

    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      animated = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        let count = 0;
        const step = Math.max(1, Math.ceil(target / 50));
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            counter.innerText = target.toLocaleString();
            clearInterval(timer);
          } else {
            counter.innerText = count.toLocaleString();
          }
        }, 30);
      });
    }
  });
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE LAUNDRY UTILITIES
   -------------------------------------------------------------------------- */
function initLaundryInteractions() {
  const quickForm = document.getElementById('quick-pickup-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('⚡ Express Pickup Requested! Our FreshFlow Valet driver will contact you within 15 minutes.');
      quickForm.reset();
    });
  }

  const calcInputs = document.querySelectorAll('.calc-qty-input');
  if (calcInputs.length > 0) {
    calcInputs.forEach(input => {
      input.addEventListener('input', calculateOrderTotal);
    });
  }
}

function calculateOrderTotal() {
  let total = 0;
  document.querySelectorAll('.calc-item-row').forEach(row => {
    const qty = parseInt(row.querySelector('.calc-qty-input').value || '0', 10);
    const price = parseFloat(row.getAttribute('data-price') || '0');
    total += qty * price;
  });

  const totalEl = document.getElementById('calc-total-price');
  if (totalEl) {
    totalEl.innerText = '$' + total.toFixed(2);
  }
}

/* --------------------------------------------------------------------------
   9. GLOBAL DARK THEME & RTL TOGGLES
   -------------------------------------------------------------------------- */
function initThemeAndRTL() {
  if (window.__theme_and_rtl_inited) return;
  window.__theme_and_rtl_inited = true;

  // Query all buttons matching theme or rtl IDs
  const themeBtns = document.querySelectorAll('#theme-toggle-btn, #mobile-theme-toggle-btn, #nav-mobile-theme-toggle-btn, .theme-toggle-trigger');
  const rtlBtns = document.querySelectorAll('#rtl-toggle-btn, #mobile-rtl-toggle-btn, #nav-mobile-rtl-toggle-btn, .rtl-toggle-trigger');

  // Load saved theme
  const savedTheme = localStorage.getItem('ff_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcons(true);
  } else {
    document.body.classList.remove('dark-mode');
    updateThemeIcons(false);
  }

  // Load saved RTL
  const savedRTL = localStorage.getItem('ff_rtl');
  if (savedRTL === 'true') {
    document.documentElement.setAttribute('dir', 'rtl');
    updateRTLButtons(true);
  } else {
    document.documentElement.removeAttribute('dir');
    updateRTLButtons(false);
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('ff_theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    });
  });

  rtlBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir');
      const isRTL = currentDir !== 'rtl';
      if (isRTL) {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem('ff_rtl', 'true');
      } else {
        document.documentElement.removeAttribute('dir');
        localStorage.setItem('ff_rtl', 'false');
      }
      updateRTLButtons(isRTL);
    });
  });

  function updateThemeIcons(isDark) {
    const themeIcons = document.querySelectorAll('#theme-toggle-icon, #mobile-theme-toggle-icon, #nav-mobile-theme-toggle-icon');
    const mobileText = document.getElementById('mobile-theme-text');

    themeIcons.forEach(icon => {
      icon.className = isDark ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-info';
    });
    if (mobileText) {
      mobileText.innerText = isDark ? 'Light Mode' : 'Dark Mode';
    }
  }

  function updateRTLButtons(isRTL) {
    const desktopTexts = document.querySelectorAll('#rtl-toggle-text, .rtl-text-span');
    const mobileText = document.getElementById('mobile-rtl-text');

    desktopTexts.forEach(el => {
      el.innerText = isRTL ? 'LTR' : 'RTL';
    });
    if (mobileText) {
      mobileText.innerText = isRTL ? 'LTR Mode' : 'RTL Mode';
    }
  }
}

/* --------------------------------------------------------------------------
   10. PASSWORD VISIBILITY EYE TOGGLE
   -------------------------------------------------------------------------- */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.password-input-wrapper');
      if (!wrapper) return;
      const input = wrapper.querySelector('input');
      const icon = btn.querySelector('i');
      if (!input || !icon) return;

      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'bi bi-eye-slash-fill';
      } else {
        input.type = 'password';
        icon.className = 'bi bi-eye-fill';
      }
    });
  });
}

window.togglePasswordVisibility = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = btn ? btn.querySelector('i') : null;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.className = 'bi bi-eye-slash-fill';
  } else {
    input.type = 'password';
    if (icon) icon.className = 'bi bi-eye-fill';
  }
};

/* --------------------------------------------------------------------------
   11. BACK-TO-TOP FLOATING BUTTON & SMOOTH SCROLL
   -------------------------------------------------------------------------- */
function initBackToTop() {
  let backBtn = document.getElementById('back-to-top-btn');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'back-to-top-btn';
    backBtn.className = 'back-to-top-btn';
    backBtn.setAttribute('aria-label', 'Back to Top');
    backBtn.setAttribute('title', 'Scroll to top');
    backBtn.innerHTML = '<i class="bi bi-arrow-up-short"></i>';
    document.body.appendChild(backBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


