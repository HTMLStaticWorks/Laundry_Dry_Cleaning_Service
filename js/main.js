/* ==========================================================================
   FreshFlow Laundry & Dry Cleaning - Main JavaScript Engine
   Includes: Three.js 3D Hero Scene, Canvas Bubbles Generator, GSAP Animations,
   Lenis Smooth Scroll, Mobile Drawer Toggle & Interactive Laundry Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavbarScroll();
  initMobileDrawer();
  initBubblesCanvas();
  initThreeJSHero();
  initGSAPAnimations();
  initCounters();
  initLaundryInteractions();
  initThemeAndRTL();
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
    }, 1200);
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
   4. CANVASES - FLOATING SOAP BUBBLES BACKGROUND
   -------------------------------------------------------------------------- */
function initBubblesCanvas() {
  const canvas = document.getElementById('bubbles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const bubbles = [];
  const bubbleCount = Math.floor(width / 35);

  class SoapBubble {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.radius = Math.random() * 18 + 6;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.hue = 190 + Math.random() * 30; // Sky blue / fresh aqua range
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.5;

      if (this.y < -50) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      // Iridescent bubble gradient
      const grad = ctx.createRadialGradient(
        this.x - this.radius * 0.3, 
        this.y - this.radius * 0.3, 
        this.radius * 0.1, 
        this.x, 
        this.y, 
        this.radius
      );
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 95%, ${this.opacity + 0.2})`);
      grad.addColorStop(0.7, `hsla(${this.hue}, 80%, 75%, ${this.opacity})`);
      grad.addColorStop(1, `hsla(${this.hue + 20}, 90%, 65%, ${this.opacity * 0.4})`);

      ctx.fillStyle = grad;
      ctx.fill();

      // Bubble highlight ring
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity + 0.3})`;
      ctx.stroke();

      // Shiny reflection curve
      ctx.beginPath();
      ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, Math.PI * 1.2, Math.PI * 1.8);
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity + 0.5})`;
      ctx.stroke();
    }
  }

  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push(new SoapBubble());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    bubbles.forEach(b => {
      b.update();
      b.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   5. THREE.JS INTERACTIVE 3D HERO CANVAS (Spinning Metallic Washing Machine Drum & Orbs)
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

  // Floating Water & Soap Spheres inside
  const sphereGroup = new THREE.Group();
  const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x10B981,
    roughness: 0.1,
    metalness: 0.6
  });

  for (let i = 0; i < 12; i++) {
    const s = new THREE.Mesh(sphereGeo, sphereMat);
    s.position.set(
      (Math.random() - 0.5) * 2.2,
      (Math.random() - 0.5) * 2.2,
      (Math.random() - 0.5) * 1.5
    );
    sphereGroup.add(s);
  }

  drumGroup.add(sphereGroup);
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

    drumGroup.rotation.z += 0.008; // Spinning drum motion
    sphereGroup.rotation.y -= 0.015;

    // Smooth lerp mouse rotation
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

  // Fade Up elements
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

  // Stagger Cards
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
        const step = Math.ceil(target / 50);
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
   8. INTERACTIVE LAUNDRY UTILITIES & MODALS
   -------------------------------------------------------------------------- */
function initLaundryInteractions() {
  // Quick Pickup Schedule Form Submission Handler
  const quickForm = document.getElementById('quick-pickup-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('⚡ Express Pickup Requested! Our FreshFlow Valet driver will contact you within 15 minutes.');
      quickForm.reset();
    });
  }

  // Interactive Price Calculator inside pricing section
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
   9. DARK THEME & RTL TOGGLES
   -------------------------------------------------------------------------- */
function initThemeAndRTL() {
  const themeBtns = [document.getElementById('theme-toggle-btn'), document.getElementById('mobile-theme-toggle-btn')];
  const rtlBtns = [document.getElementById('rtl-toggle-btn'), document.getElementById('mobile-rtl-toggle-btn')];

  // Load saved theme
  const savedTheme = localStorage.getItem('ff_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcons(true);
  }

  // Load saved RTL
  const savedRTL = localStorage.getItem('ff_rtl');
  if (savedRTL === 'true') {
    document.documentElement.setAttribute('dir', 'rtl');
    updateRTLButtons(true);
  }

  themeBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('ff_theme', isDark ? 'dark' : 'light');
        updateThemeIcons(isDark);
      });
    }
  });

  rtlBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
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
    }
  });

  function updateThemeIcons(isDark) {
    const desktopIcon = document.getElementById('theme-toggle-icon');
    const mobileIcon = document.getElementById('mobile-theme-toggle-icon');
    const mobileText = document.getElementById('mobile-theme-text');

    if (desktopIcon) {
      desktopIcon.className = isDark ? 'bi bi-sun-fill fs-6 text-warning' : 'bi bi-moon-stars-fill fs-6 text-info';
    }
    if (mobileIcon) {
      mobileIcon.className = isDark ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-info';
    }
    if (mobileText) {
      mobileText.innerText = isDark ? 'Light Mode' : 'Dark Mode';
    }
  }

  function updateRTLButtons(isRTL) {
    const desktopText = document.getElementById('rtl-toggle-text');
    const mobileText = document.getElementById('mobile-rtl-text');

    if (desktopText) {
      desktopText.innerText = isRTL ? 'LTR' : 'RTL';
    }
    if (mobileText) {
      mobileText.innerText = isRTL ? 'LTR Mode' : 'RTL Mode';
    }
  }
}

