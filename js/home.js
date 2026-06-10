// home.js - homepage features
// quote slider, destination of the day, and newsletter form

document.addEventListener('DOMContentLoaded', function() {
  startQuoteRotation();
  loadDestinationOfTheDay();
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

  // Update existing elements instead of overwriting innerHTML
  var img = document.getElementById('dod-img');
  if (img) {
    img.src = dest.image;
    img.alt = dest.name;
  }
  
  var title = document.getElementById('dod-title');
  if (title) title.textContent = dest.name + ', ' + dest.country;
  
  var continent = document.getElementById('dod-continent');
  if (continent) continent.textContent = dest.continent;
  
  var type = document.getElementById('dod-type');
  if (type) type.textContent = dest.travelType.toUpperCase();
  
  var budget = document.getElementById('dod-budget');
  if (budget) budget.textContent = dest.budgetRange.toUpperCase() + ' BUDGET';
  
  var desc = document.getElementById('dod-desc');
  if (desc) desc.textContent = dest.description;
  
  var link = document.getElementById('dod-link');
  if (link) link.href = './pages/explorer.html?id=' + dest.id;
}
