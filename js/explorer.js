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

  // current filter state variables
  var selectedContinent = 'all';
  var selectedType = 'all';
  var searchText = '';

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
    grid.innerHTML = '';

    var results = [];

    // go through all destinations and check filters
    for (var i = 0; i < travelDestinations.length; i++) {
      var d = travelDestinations[i];

      var continentOk = (selectedContinent === 'all' || d.continent === selectedContinent);
      var typeOk = (selectedType === 'all' || d.travelType === selectedType);
      var searchOk = (searchText === '' ||
        d.name.toLowerCase().indexOf(searchText) !== -1 ||
        d.country.toLowerCase().indexOf(searchText) !== -1);

      if (continentOk && typeOk && searchOk) {
        results.push(d);
      }
    }

    // show message if nothing matched
    if (results.length === 0) {
      grid.innerHTML = '<div class="no-results"><h3>No Destinations Found</h3><p>Try adjusting your filters or search term.</p></div>';
      return;
    }

    // build a card for each result
    for (var i = 0; i < results.length; i++) {
      var dest = results[i];

      // fix path since we are inside /pages/ subfolder
      var imgUrl = dest.image;
      if (imgUrl.indexOf('assets') === 0) {
        imgUrl = '../' + imgUrl;
      }

      var card = document.createElement('div');
      card.className = 'dest-card';
      card.innerHTML =
        '<div class="dest-img-box">' +
          '<img src="' + imgUrl + '" alt="' + dest.name + '" class="dest-card-img" onerror="this.src=\'../assets/placeholder.jpg\'">' +
          '<span class="dest-type-badge">' + dest.travelType + '</span>' +
        '</div>' +
        '<div class="dest-info">' +
          '<div class="dest-card-meta">' +
            '<span>🌍 ' + dest.continent + '</span>' +
            '<span>💰 ' + dest.budgetRange.toUpperCase() + '</span>' +
          '</div>' +
          '<h3 class="dest-card-title">' + dest.name + ', ' + dest.country + '</h3>' +
          '<p class="dest-card-desc">' + dest.description + '</p>' +
          '<div class="dest-card-footer"><span>View Details</span><span>→</span></div>' +
        '</div>';

      // use closure to capture dest in the loop correctly
      (function(destination) {
        card.addEventListener('click', function() {
          openModal(destination);
        });
      })(dest);

      grid.appendChild(card);
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
      '<span>🌍 ' + dest.continent + '</span> &nbsp;' +
      '<span>🧭 ' + dest.travelType.toUpperCase() + '</span> &nbsp;' +
      '<span>💰 ' + dest.budgetRange.toUpperCase() + ' BUDGET</span>';

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

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }
}
