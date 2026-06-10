// explorer.js - destination explorer page
// handles search, filter, card render and modal popup

document.addEventListener('DOMContentLoaded', function() {
  setupExplorer();
});

function setupExplorer() {
  var searchInput = document.getElementById('search-name');
  var typeSelect = document.getElementById('select-type');
  var continentContainer = document.getElementById('continent-pills');
  var grid = document.getElementById('explorer-grid');
  var modal = document.getElementById('details-modal');
  var closeBtn = document.getElementById('modal-close-btn');
  var lastFocusedElement = null;

  // current filter state variables
  var selectedContinent = 'all';
  var selectedType = 'all';
  var searchText = '';

  // attach click listeners to existing cards
  var allCards = grid ? grid.querySelectorAll('.dest-card') : [];
  for (var i = 0; i < allCards.length; i++) {
    (function(card) {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', function() {
        var destId = card.getAttribute('data-id');
        var dest = findById(destId);
        if (dest) openModal(dest);
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    })(allCards[i]);
  }

  // render all cards on load
  renderCards();

  // check if a destination id was passed in the url (for deep linking)
  var params = new URLSearchParams(window.location.search);
  var targetId = params.get('id');
  if (targetId) {
    var dest = findById(targetId);
    if (dest) openModal(dest);
  }

  // search box listener
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchText = searchInput.value.toLowerCase().trim();
      renderCards();
    });
  }

  // experience type dropdown
  if (typeSelect) {
    typeSelect.addEventListener('change', function() {
      selectedType = typeSelect.value;
      renderCards();
    });
  }

  // continent pill buttons
  if (continentContainer) {
    var pills = continentContainer.querySelectorAll('.pill');
    for (var i = 0; i < pills.length; i++) {
      pills[i].addEventListener('click', function() {
        // remove active from all pills then set on clicked one
        for (var j = 0; j < pills.length; j++) {
          pills[j].classList.remove('is-active');
        }
        this.classList.add('is-active');
        selectedContinent = this.getAttribute('data-continent');
        renderCards();
      });
    }
  }

  // close modal button
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      closeModal();
    });
  }

  // clicking outside modal closes it
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
  }

  // escape key also closes modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  // filters data and renders destination cards
  function renderCards() {
    if (!grid) return;

    var cards = grid.querySelectorAll('.dest-card');
    var hasResults = false;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var cContinent = card.getAttribute('data-continent');
      var cType = card.getAttribute('data-type');
      var cName = card.getAttribute('data-name');
      var cCountry = card.getAttribute('data-country');

      var continentOk = (selectedContinent === 'all' || cContinent === selectedContinent);
      var typeOk = (selectedType === 'all' || cType === selectedType);
      var searchOk = (searchText === '' ||
        cName.indexOf(searchText) !== -1 ||
        cCountry.indexOf(searchText) !== -1);

      if (continentOk && typeOk && searchOk) {
        card.style.display = 'flex';
        hasResults = true;
      } else {
        card.style.display = 'none';
      }
    }

    var noResults = grid.querySelector('.no-results');
    if (!hasResults) {
      if (!noResults) {
        var msg = document.createElement('div');
        msg.className = 'no-results';
        msg.innerHTML = '<h3>No Destinations Found</h3><p>Try adjusting your filters or search term.</p>';
        grid.appendChild(msg);
      } else {
        noResults.style.display = 'block';
      }
    } else if (noResults) {
      noResults.style.display = 'none';
    }
  }

  // finds a destination object by its id
  function findById(id) {
    for (var i = 0; i < travelDestinations.length; i++) {
      if (travelDestinations[i].id === id) return travelDestinations[i];
    }
    return null;
  }

  // opens the detail modal and fills it with destination data
  // this section was little tricky to get all elements lined up
  function openModal(dest) {
    var imgUrl = dest.image;
    if (imgUrl.indexOf('assets') === 0) imgUrl = '../' + imgUrl;

    document.getElementById('modal-img').src = imgUrl;
    document.getElementById('modal-img').alt = dest.name;
    document.getElementById('modal-title').textContent = dest.name + ', ' + dest.country;

    document.getElementById('modal-meta').innerHTML =
      '<span> ' + dest.continent + '</span> &nbsp;' +
      '<span> ' + dest.travelType.toUpperCase() + '</span> &nbsp;' +
      '<span> ' + dest.budgetRange.toUpperCase() + ' BUDGET</span>';

    document.getElementById('modal-desc').textContent = dest.description;

    // attractions list
    var attrList = document.getElementById('modal-attractions');
    attrList.innerHTML = '';
    for (var i = 0; i < dest.attractions.length; i++) {
      var li = document.createElement('li');
      li.textContent = dest.attractions[i];
      attrList.appendChild(li);
    }

    // cost table rows
    var tbody = document.getElementById('modal-costs-tbody');
    tbody.innerHTML = '';
    var tiers = ['budget', 'moderate', 'luxury'];
    for (var i = 0; i < tiers.length; i++) {
      var tier = tiers[i];
      var costs = dest.costs[tier];
      var total = costs.accommodation + costs.food + costs.transport;
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td style="text-transform:capitalize; font-weight:bold;">' + tier + '</td>' +
        '<td>$' + costs.accommodation + '/day</td>' +
        '<td>$' + costs.food + '/day</td>' +
        '<td>$' + costs.transport + '/day</td>' +
        '<td style="color:var(--accent-blue); font-weight:bold;">$' + total + '/day</td>';
      tbody.appendChild(tr);
    }

    // recipe details
    if (dest.recipeData) {
      document.getElementById('modal-recipe-name').textContent = dest.recipeData.dishName;
      document.getElementById('modal-recipe-diff').textContent = dest.recipeData.difficulty;
      document.getElementById('modal-recipe-prep').textContent = dest.recipeData.prepTime;
      document.getElementById('modal-recipe-desc').textContent = 'Instructions: ' + dest.recipeData.instructions;
    }

    // workout details
    if (dest.workoutData) {
      document.getElementById('modal-workout-name').textContent = dest.workoutData.activityName;
      document.getElementById('modal-workout-intensity').textContent = dest.workoutData.intensity;
      document.getElementById('modal-workout-calories').textContent = dest.workoutData.caloriesBurned;
      document.getElementById('modal-workout-desc').textContent = dest.workoutData.description + ' (Duration: ' + dest.workoutData.duration + ')';
    }

    lastFocusedElement = document.activeElement;
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('is-active')) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  }
}
