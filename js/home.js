// home.js - homepage features
// quote slider, destination of the day, and newsletter form

document.addEventListener('DOMContentLoaded', function() {
  startQuoteRotation();
  loadDestinationOfTheDay();
  setupNewsletterForm();
});

// rotates travel quotes in the hero section every few seconds
function startQuoteRotation() {
  var container = document.getElementById('quote-slider');
  if (!container) return;

  var quoteText = container.querySelector('.quote-text');
  var quoteAuthor = container.querySelector('.quote-author');

  var index = 0;

  // show first quote straight away
  showQuote(index);

  // swap quote every 5 seconds
  setInterval(function() {
    index = index + 1;
    if (index >= travelQuotes.length) {
      index = 0;
    }
    showQuote(index);
  }, 5000);

  function showQuote(i) {
    var q = travelQuotes[i];
    quoteText.textContent = '"' + q.text + '"';
    quoteAuthor.textContent = '- ' + q.author;
  }
}

// picks todays destnation using simple date math
// same destination shows for the whole day, changes at midnight
function loadDestinationOfTheDay() {
  var container = document.getElementById('dod-container');
  if (!container) return;
  if (!travelDestinations || travelDestinations.length === 0) return;

  var today = new Date();
  // adding year + month + day to get a unique number per day
  var dateSum = today.getFullYear() + today.getMonth() + today.getDate();
  var index = dateSum % travelDestinations.length;
  var dest = travelDestinations[index];

  // simple card render
  container.innerHTML =
    '<div class="dod-card">' +
      '<img src="' + dest.image + '" alt="' + dest.name + '" class="dod-img" onerror="this.src=\'assets/placeholder.jpg\'">' +
      '<div class="dod-content">' +
        '<span class="dod-badge">⭐ Destination of the Day</span>' +
        '<h3 class="dod-title">' + dest.name + ', ' + dest.country + '</h3>' +
        '<div class="dod-meta">' +
          '<span>🌍 ' + dest.continent + '</span>' +
          '<span>🧭 ' + dest.travelType.toUpperCase() + '</span>' +
          '<span>💰 ' + dest.budgetRange.toUpperCase() + ' BUDGET</span>' +
        '</div>' +
        '<p class="dod-desc">' + dest.description + '</p>' +
        '<div style="margin-top: 14px;">' +
          '<a href="./pages/explorer.html?id=' + dest.id + '" class="btn btn-primary">Explore Destination →</a>' +
        '</div>' +
      '</div>' +
    '</div>';
}

// newsletter form - saves email to localStorage
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
      emails = JSON.parse(stored);
    }

    // dont save duplicates
    if (emails.indexOf(email) !== -1) {
      if (window.showNotification) {
        window.showNotification('You are already subscribed!', 'info');
      }
      form.reset();
      return;
    }

    // add and save
    emails.push(email);
    localStorage.setItem('newsletter_emails', JSON.stringify(emails));

    if (window.showNotification) {
      window.showNotification('Thanks for subscribing!', 'success');
    }
    form.reset();
  });
}
