/* ==========================================================================
   FreshFlow Laundry & Dry Cleaning - Customer Dashboard Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initDashboardSidebar();
  initSchedulePickupModal();
  initLiveTracker();
  initAddressManager();
  // Theme and RTL are initialized once globally by main.js
  const savedTheme = localStorage.getItem('ff_theme');
  if (savedTheme === 'dark') document.body.classList.add('dark-mode');
  const savedRTL = localStorage.getItem('ff_rtl');
  if (savedRTL === 'true') document.documentElement.setAttribute('dir', 'rtl');
});

/* --------------------------------------------------------------------------
   1. DASHBOARD TAB NAVIGATION
   -------------------------------------------------------------------------- */
function initDashboardTabs() {
  const navItems = document.querySelectorAll('.dashboard-nav-item');
  const sections = document.querySelectorAll('.dashboard-tab-content');

  if (navItems.length === 0) return;

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-tab');

      // Update sidebar nav active state
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Show target content tab
      sections.forEach(sec => {
        if (sec.id === targetId) {
          sec.classList.remove('d-none');
          sec.classList.add('active-tab');
        } else {
          sec.classList.add('d-none');
          sec.classList.remove('active-tab');
        }
      });

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.dashboard-sidebar');
      if (sidebar) sidebar.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE DASHBOARD SIDEBAR TOGGLE
   -------------------------------------------------------------------------- */
function initDashboardSidebar() {
  const toggleBtn = document.getElementById('dashboard-sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  let overlay = document.getElementById('dashboard-sidebar-overlay');
  const navItems = document.querySelectorAll('.dashboard-nav-item');

  if (!overlay && sidebar) {
    overlay = document.createElement('div');
    overlay.id = 'dashboard-sidebar-overlay';
    overlay.className = 'dashboard-sidebar-overlay';
    document.body.appendChild(overlay);
  }

  function openSidebar() {
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar && sidebar.classList.contains('active')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  navItems.forEach(item => {
    item.addEventListener('click', closeSidebar);
  });
}

/* --------------------------------------------------------------------------
   3. SCHEDULE PICKUP MODAL & ESTIMATOR
   -------------------------------------------------------------------------- */
function initSchedulePickupModal() {
  const modalForm = document.getElementById('schedule-pickup-form');
  if (!modalForm) return;

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate booking creation
    const orderId = 'FF-' + Math.floor(100000 + Math.random() * 900000);
    const date = document.getElementById('pickup-date').value || 'Tomorrow at 10:00 AM';
    
    alert(`🎉 Pickup Scheduled Successfully!\nOrder ID: ${orderId}\nScheduled Window: ${date}\n\nOur driver has been assigned.`);

    modalForm.reset();

    // Close Bootstrap Modal if open
    const modalEl = document.getElementById('schedulePickupModal');
    if (modalEl && window.bootstrap) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  });
}

/* --------------------------------------------------------------------------
   4. LIVE STATUS TRACKER SWITCHER SIMULATION
   -------------------------------------------------------------------------- */
function initLiveTracker() {
  const statusSelect = document.getElementById('order-status-simulator');
  const steps = document.querySelectorAll('.tracker-step');

  if (!statusSelect || steps.length === 0) return;

  statusSelect.addEventListener('change', (e) => {
    const activeIndex = parseInt(e.target.value, 10);

    steps.forEach((step, index) => {
      step.classList.remove('completed', 'active');
      if (index < activeIndex) {
        step.classList.add('completed');
      } else if (index === activeIndex) {
        step.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. ADDRESS MANAGEMENT
   -------------------------------------------------------------------------- */
function initAddressManager() {
  const addBtn = document.getElementById('add-address-btn');
  const addressContainer = document.getElementById('address-list-container');

  if (!addBtn || !addressContainer) return;

  addBtn.addEventListener('click', () => {
    const label = prompt('Enter Address Label (e.g. Home, Office, Beach House):');
    if (!label) return;
    const address = prompt('Enter Full Street Address:');
    if (!address) return;

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';
    col.innerHTML = `
      <div class="card glass-card p-4 h-100">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="badge bg-primary px-3 py-2 rounded-pill"><i class="bi bi-geo-alt me-1"></i> ${label}</span>
          <button class="btn btn-sm btn-outline-danger delete-address-btn"><i class="bi bi-trash"></i></button>
        </div>
        <p class="fw-semibold text-dark mb-1">${address}</p>
        <small class="text-muted">Added Just Now</small>
      </div>
    `;

    addressContainer.appendChild(col);

    // Add delete listener
    col.querySelector('.delete-address-btn').addEventListener('click', () => {
      col.remove();
    });
  });
}
