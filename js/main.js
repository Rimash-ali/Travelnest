// main.js - shared code that runs on every page
// handles navbar, dark mode, scroll reveal, notifications and PWA

document.addEventListener('DOMContentLoaded', function() {
  setupNavbar();
  setupDarkMode();
  setupHeaderScroll();
  highlightActiveLink();
  setupScrollReveal();
  registerServiceWorker();
});

// simple toast notification - shows a message box at top right
function showNotification(message, type, duration) {
  if (!duration) duration = 3500;

  // check if container already exists, make one if not
  var container = document.getElementById('notif-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notif-container';
    container.style.cssText = 'position:fixed; top:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:8px; max-width:340px; width:calc(100% - 40px);';
    document.body.appendChild(container);
  }

  // create the notif box
  var notif = document.createElement('div');
  notif.style.cssText = 'padding:11px 16px; border-radius:4px; background:#fff; border-left:4px solid #ccc; font-size:0.88rem; box-shadow:2px 2px 8px rgba(0,0,0,0.12); color:#1e293b;';

  // change border color depending on type
  if (type === 'success') {
    notif.style.borderColor = '#16a34a';
  } else if (type === 'error') {
    notif.style.borderColor = '#dc2626';
  } else {
    notif.style.borderColor = '#0284c7';
  }

  notif.textContent = message;
  container.appendChild(notif);

  // auto remove after delay
  setTimeout(function() {
    if (notif.parentNode) {
      notif.parentNode.removeChild(notif);
    }
  }, duration);
}

// mobile nav open logic
function setupNavbar() {
  var burger = document.querySelector('.navbar-burger');
  var menu = document.querySelector('.navbar-menu');

  if (!burger || !menu) return;

  burger.addEventListener('click', function() {
    // toggle class to show/hide nav
    if (menu.classList.contains('is-active')) {
      menu.classList.remove('is-active');
    } else {
      menu.classList.add('is-active');
    }
  });

  // close menu when any nav link is clicked
  var links = menu.querySelectorAll('.navbar-item');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
      menu.classList.remove('is-active');
    });
  }
}

// dark mode toggle button - injected into the navbar dynamically
// saves preference to localStorage
function setupDarkMode() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // create the toggle button
  var btn = document.createElement('button');
  btn.id = 'dark-toggle-btn';
  btn.className = 'dark-toggle-btn';
  btn.title = 'Toggle dark mode';
  btn.setAttribute('aria-label', 'Toggle dark mode');

  // check saved preference on load
  if (localStorage.getItem('dark_mode') === 'on') {
    document.body.classList.add('dark-mode');
    btn.textContent = '☀️';
  } else {
    btn.textContent = '🌙';
  }

  // insert button before the burger menu
  var burger = navbar.querySelector('.navbar-burger');
  if (burger) {
    navbar.insertBefore(btn, burger);
  } else {
    navbar.appendChild(btn);
  }

  // toggle dark mode on click
  btn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('dark_mode', 'on');
      btn.textContent = '☀️';
    } else {
      localStorage.setItem('dark_mode', 'off');
      btn.textContent = '🌙';
    }
  });
}

// adds shadow to header when user scrolls down the page
function setupHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
}

// marks the current page link as active in the nav
function highlightActiveLink() {
  var currentPage = window.location.pathname.split('/').pop();
  if (!currentPage) currentPage = 'index.html';

  var links = document.querySelectorAll('.navbar-item');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href');
    if (!href) continue;
    var linkPage = href.split('/').pop();
    if (linkPage === currentPage) {
      links[i].classList.add('is-active-link');
    }
  }
}

// scroll reveal - fades in elements with .reveal class as they scroll into view
// uses IntersectionObserver to detect when element enters the viewport
function setupScrollReveal() {
  var elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('is-visible');
        // stop observing once its visible - no need to keep watching
        observer.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.12 });

  // attach observer to each element
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
}

// registers the PWA service worker
// works out the right path based on current page location
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  // handle both root and /pages/ subfolders
  var basePath = window.location.pathname.split('/pages/')[0];
  if (!basePath) basePath = '.';

  navigator.serviceWorker.register(basePath + '/sw.js').then(function(reg) {
    console.log('SW registered, scope:', reg.scope);
  }).catch(function(err) {
    // not a critical error, just log it
    console.log('SW registration failed:', err);
  });
}

// expose showNotification so other scripts can use it
window.showNotification = showNotification;
