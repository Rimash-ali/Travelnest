// generator.js - random trip generator
// picks a matching destination based on user preferences

document.addEventListener('DOMContentLoaded', function() {
  setupGenerator();
});

function setupGenerator() {
  var surpriseBtn = document.getElementById('gen-surprise-btn');
  var typeSelect = document.getElementById('gen-type');
  var budgetSelect = document.getElementById('gen-budget');
  var loader = document.getElementById('gen-loader');
  var resultCard = document.getElementById('gen-result-card');

  var resultImg = document.getElementById('result-img');
  var resultTypeBadge = document.getElementById('result-type-badge');
  var resultFallbackBadge = document.getElementById('result-fallback-badge');
  var resultTitle = document.getElementById('result-title');
  var resultContinent = document.getElementById('result-continent');
  var resultBudget = document.getElementById('result-budget');
  var resultDesc = document.getElementById('result-description');
  var wishlistBtn = document.getElementById('add-wishlist-btn');
  var explorerLink = document.getElementById('explorer-link-btn');
  var wishlistContainer = document.getElementById('wishlist-container');

  // this stores the current shown destination
  var currentDest = null;

  // show wishlist on load
  renderWishlist();

  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', function() {
      var type = typeSelect.value;
      var budget = budgetSelect.value;

      // adding some smooth animation effect on the button click
      surpriseBtn.classList.add('btn-animating');
      setTimeout(function() {
        surpriseBtn.classList.remove('btn-animating');
      }, 500);

      // show loader and hide old result
      resultCard.style.display = 'none';
      loader.style.display = 'flex';
      surpriseBtn.disabled = true;

      // short delay to show the loader, then show result
      setTimeout(function() {
        loader.style.display = 'none';
        surpriseBtn.disabled = false;
        findAndShowDestination(type, budget);
      }, 1100);
    });
  }

  // tries to find a matching destination with fallbacks
  function findAndShowDestination(type, budget) {
    var matches = [];
    var isFallback = false;

    // first try exact match on type and budget
    for (var i = 0; i < travelDestinations.length; i++) {
      if (travelDestinations[i].travelType === type && travelDestinations[i].budgetRange === budget) {
        matches.push(travelDestinations[i]);
      }
    }

    // fallback 1 - match only by travel type
    if (matches.length === 0) {
      isFallback = true;
      for (var i = 0; i < travelDestinations.length; i++) {
        if (travelDestinations[i].travelType === type) {
          matches.push(travelDestinations[i]);
        }
      }
    }

    // fallback 2 - match only by budget range
    if (matches.length === 0) {
      for (var i = 0; i < travelDestinations.length; i++) {
        if (travelDestinations[i].budgetRange === budget) {
          matches.push(travelDestinations[i]);
        }
      }
    }

    // last resort - use all destinations
    if (matches.length === 0) {
      matches = travelDestinations;
    }

    // pick randomly from the matched list
    var randomIndex = Math.floor(Math.random() * matches.length);
    currentDest = matches[randomIndex];

    showDestination(currentDest, isFallback);
  }

  // fills result card with destination info
  function showDestination(dest, isFallback) {
    var imgUrl = dest.image;
    if (imgUrl.indexOf('assets') === 0) {
      imgUrl = '../' + imgUrl;
    }

    resultImg.src = imgUrl;
    resultImg.alt = dest.name;
    resultTitle.textContent = dest.name + ', ' + dest.country;
    resultTypeBadge.textContent = dest.travelType;
    resultContinent.textContent = dest.continent;
    resultBudget.textContent = dest.budgetRange.toUpperCase() + ' BUDGET';
    resultDesc.textContent = dest.description;
    explorerLink.href = './explorer.html?id=' + dest.id;

    // show alt badge if its not an exact filter match
    if (isFallback) {
      resultFallbackBadge.textContent = 'Alt Match';
      resultFallbackBadge.style.display = 'block';
    } else {
      resultFallbackBadge.style.display = 'none';
    }

    updateWishlistBtn(dest.id);
    resultCard.style.display = 'block';
  }

  // updates the wishlist button to show if already saved
  function updateWishlistBtn(id) {
    var stored = localStorage.getItem('wishlist_destinations');
    var wishlist = [];
    if (stored) wishlist = JSON.parse(stored);

    var alreadySaved = false;
    for (var i = 0; i < wishlist.length; i++) {
      if (wishlist[i].id === id) {
        alreadySaved = true;
        break;
      }
    }

    if (alreadySaved) {
      wishlistBtn.textContent = '❤ Wishlisted';
      wishlistBtn.classList.remove('btn-primary');
      wishlistBtn.classList.add('btn-outline');
    } else {
      wishlistBtn.textContent = '♡ Add to Wishlist';
      wishlistBtn.classList.remove('btn-outline');
      wishlistBtn.classList.add('btn-primary');
    }
  }

  // this stores the users wishlist in localStorage
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function() {
      if (!currentDest) return;

      var stored = localStorage.getItem('wishlist_destinations');
      var wishlist = [];
      if (stored) wishlist = JSON.parse(stored);

      // check if already in list
      var foundIdx = -1;
      for (var i = 0; i < wishlist.length; i++) {
        if (wishlist[i].id === currentDest.id) {
          foundIdx = i;
          break;
        }
      }

      if (foundIdx !== -1) {
        // remove from list
        wishlist.splice(foundIdx, 1);
        localStorage.setItem('wishlist_destinations', JSON.stringify(wishlist));
        if (window.showNotification) window.showNotification('Removed from wishlist.', 'info');
      } else {
        // add to list
        wishlist.push({
          id: currentDest.id,
          name: currentDest.name,
          country: currentDest.country,
          image: currentDest.image,
          continent: currentDest.continent,
          travelType: currentDest.travelType
        });
        localStorage.setItem('wishlist_destinations', JSON.stringify(wishlist));
        if (window.showNotification) window.showNotification('Added ' + currentDest.name + ' to wishlist!', 'success');
      }

      updateWishlistBtn(currentDest.id);
      renderWishlist();
    });
  }

  // renders wishlist sidebar from localStorage
  function renderWishlist() {
    if (!wishlistContainer) return;

    var stored = localStorage.getItem('wishlist_destinations');
    var wishlist = [];
    if (stored) wishlist = JSON.parse(stored);

    wishlistContainer.innerHTML = '';

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = '<div class="wishlist-empty"><p>Your wishlist is empty. Generate a trip and click "Add to Wishlist" to save it.</p></div>';
      return;
    }

    // loop and render each item
    for (var i = 0; i < wishlist.length; i++) {
      var item = wishlist[i];
      var imgUrl = item.image;
      if (imgUrl.indexOf('assets') === 0) imgUrl = '../' + imgUrl;

      var el = document.createElement('div');
      el.className = 'wishlist-item';
      el.innerHTML =
        '<div class="wishlist-details" style="cursor:pointer;">' +
          '<img src="' + imgUrl + '" alt="' + item.name + '" class="wishlist-thumb" onerror="this.src=\'../assets/placeholder.jpg\'">' +
          '<div class="wishlist-info">' +
            '<h4>' + item.name + '</h4>' +
            '<p>' + item.country + ' | ' + item.travelType.toUpperCase() + '</p>' +
          '</div>' +
        '</div>' +
        '<button class="wishlist-delete" data-id="' + item.id + '" title="Remove">✕</button>';

      // clicking the item card links to explorer
      (function(itemId) {
        el.querySelector('.wishlist-details').addEventListener('click', function() {
          window.location.href = './explorer.html?id=' + itemId;
        });
      })(item.id);

      // delete button
      (function(itemId, itemName) {
        el.querySelector('.wishlist-delete').addEventListener('click', function(e) {
          e.stopPropagation();
          removeFromWishlist(itemId, itemName);
        });
      })(item.id, item.name);

      wishlistContainer.appendChild(el);
    }
  }

  // removes one item from wishlist by id
  function removeFromWishlist(id, name) {
    var stored = localStorage.getItem('wishlist_destinations');
    var wishlist = [];
    if (stored) wishlist = JSON.parse(stored);

    var updated = [];
    for (var i = 0; i < wishlist.length; i++) {
      if (wishlist[i].id !== id) updated.push(wishlist[i]);
    }

    localStorage.setItem('wishlist_destinations', JSON.stringify(updated));
    if (window.showNotification) window.showNotification('Removed ' + name + ' from wishlist.', 'info');
    renderWishlist();

    // update button if this was the current shown dest
    if (currentDest && currentDest.id === id) {
      updateWishlistBtn(id);
    }
  }
}
