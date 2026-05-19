// travelnest core shared script
// has general setup, navbar code, and custom alert system

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeaderScroll();
  initRevealOnScroll();
});

// custom toast alert mesage function to show succss or error banners
function showNotification(message, type = 'success', duration = 4000) {
  // check if container exists, otherwise make a new one
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
      max-width: 380px;
      width: calc(100% - 48px);
    `;
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  
  // Custom styling dynamically or via CSS classes (CSS preferred, but inline protects behavior)
  toast.style.cssText = `
    padding: 12px 18px;
    border-radius: 6px;
    background: #ffffff;
    color: #1e293b;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-left: 5px solid;
    font-weight: 500;
    font-size: 0.95rem;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    transform: translateX(120%);
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
  `;

  // Dynamic path detection for icons
  const isSubpage = window.location.pathname.includes('/pages/');
  const iconPathPrefix = isSubpage ? '../assets/icons/' : 'assets/icons/';

  // Color theme logic based on type
  if (type === 'success') {
    toast.style.borderColor = '#10b981'; // Emerald
    toast.innerHTML = `<span style="display:flex;align-items:center;gap:8px;"><img src="${iconPathPrefix}success-badge.png" alt="Success" style="width:16px;height:16px;object-fit:contain;"> ${message}</span>`;
  } else if (type === 'error') {
    toast.style.borderColor = '#ef4444'; // Red
    toast.innerHTML = `<span style="display:flex;align-items:center;gap:8px;"><img src="${iconPathPrefix}error-badge.png" alt="Error" style="width:16px;height:16px;object-fit:contain;"> ${message}</span>`;
  } else {
    toast.style.borderColor = '#3b82f6'; // Blue
    toast.innerHTML = `<span style="display:flex;align-items:center;gap:8px;"><img src="${iconPathPrefix}info-badge.png" alt="Info" style="width:16px;height:16px;object-fit:contain;"> ${message}</span>`;
  }

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = 'background:none;border:none;font-size:1.3rem;cursor:pointer;color:#94a3b8;line-height:1;padding:0;';
  closeBtn.onclick = () => removeToast(toast);
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  // Trigger animation after adding to DOM
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  }, 50);

  // Auto remove
  const autoRemoveTimer = setTimeout(() => {
    removeToast(toast);
  }, duration);

  function removeToast(el) {
    el.style.transform = 'translateX(120%)';
    el.style.opacity = '0';
    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 400);
  }
}

// handles responsive mobile burger menu toggles
function initNavbar() {
  const burger = document.querySelector('.navbar-burger');
  const menu = document.querySelector('.navbar-menu');
  
  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
    });

    // close menu on clicking links
    menu.querySelectorAll('.navbar-item').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('is-active');
        menu.classList.remove('is-active');
      });
    });
  }

  // high-light the active page menu link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-item');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // compare links clean path names
      const cleanHref = href.replace('../', '').replace('./', '');
      const cleanPath = currentPath.split('/').pop() || 'index.html';
      
      if (cleanPath === cleanHref || (cleanPath === 'index.html' && cleanHref === '') || (cleanPath === '' && cleanHref === 'index.html')) {
        link.classList.add('is-active-link');
      }
    }
  });
}

// header shrink styling on scroll
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    });
  }
}

// reveal animations using standard intersection observer
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // stop observing so it only runs once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // fallback if browser doesnt support observer
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

// Global Exports
window.showNotification = showNotification;
