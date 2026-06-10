// main.js - shared code that runs on every page
// handles navbar, dark mode, scroll reveal, notifications and PWA

document.addEventListener('DOMContentLoaded', function() {
  setupNavbar();
  setupHeaderScroll();
  highlightActiveLink();
  setupScrollReveal();
  setupNewsletterForm();
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
  notif.style.cssText = 'padding:11px 16px; border-radius:4px; background:#1e293b; border-left:4px solid #ccc; font-size:0.88rem; box-shadow:2px 4px 12px rgba(0,0,0,0.25); color:#f8fafc;';

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
      burger.setAttribute('aria-expanded', 'false');
    } else {
      menu.classList.add('is-active');
      burger.setAttribute('aria-expanded', 'true');
    }
  });

  // close menu when any nav link is clicked
  var links = menu.querySelectorAll('.navbar-item');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
      menu.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
    });
  }
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

// newsletter form - saves email to localStorage
// this runs on every page since the footer is on all pages
function setupNewsletterForm() {
  var form = document.getElementById('newsletter-form');
  var emailInput = document.getElementById('newsletter-email');
  if (!form || !emailInput) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = emailInput.value.trim();
    if (!email) return;

    // get existing emails from storage
    var stored = localStorage.getItem('newsletter_emails');
    var emails = [];
    if (stored) {
      try {
        emails = JSON.parse(stored);
      } catch (err) {
        emails = [];
      }
    }

    // dont save duplicates
    if (emails.indexOf(email) !== -1) {
      showNotification('You are already subscribed!', 'info');
      form.reset();
      return;
    }

    // add the email and save back to localStorage
    emails.push(email);
    localStorage.setItem('newsletter_emails', JSON.stringify(emails));
    showNotification('Thanks for subscribing!', 'success');
    form.reset();
  });
}
