// mood.js - ambient sounds and personal travel tracker
// two separate features on this page

document.addEventListener('DOMContentLoaded', function() {
  setupAmbientSounds();
  setupTravelTracker();
});

// handles the play/pause buttons for each sound card
function setupAmbientSounds() {
  var buttons = document.querySelectorAll('.play-toggle-btn');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      var soundType = this.getAttribute('data-sound');
      var card = document.getElementById('sound-card-' + soundType);
      var audio = document.getElementById('audio-' + soundType);
      var btn = this;

      if (!audio || !card) return;

      var isPlaying = card.classList.contains('is-playing');

      // stop all other sounds before playing this one
      stopAllSounds(soundType);

      if (isPlaying) {
        audio.pause();
        card.classList.remove('is-playing');
        btn.textContent = 'Play Sound';
      } else {
        // try to play - browser might block it
        audio.play().then(function() {
          card.classList.add('is-playing');
          btn.textContent = 'Pause Sound';
        }).catch(function(err) {
          // browser blocked autoplay, run in demo mode
          console.log('audio blocked:', err);
          card.classList.add('is-playing');
          btn.textContent = 'Pause (Demo)';
          if (window.showNotification) {
            window.showNotification('Audio blocked by browser - running in demo mode.', 'info');
          }
        });
      }
    });
  }

  // pauses all sounds except the one being played now
  function stopAllSounds(exceptType) {
    var allAudios = document.querySelectorAll('audio');
    for (var i = 0; i < allAudios.length; i++) {
      var type = allAudios[i].id.replace('audio-', '');
      if (type !== exceptType) {
        allAudios[i].pause();
        var card = document.getElementById('sound-card-' + type);
        var btn = document.querySelector('[data-sound="' + type + '"]');
        if (card) card.classList.remove('is-playing');
        if (btn) btn.textContent = 'Play Sound';
      }
    }
  }
}

// visited and planned tracker feature
function setupTravelTracker() {
  var trackerList = document.getElementById('tracker-list');
  var visitedCountEl = document.getElementById('stat-visited-count');
  var plannedCountEl = document.getElementById('stat-planned-count');
  var percentEl = document.getElementById('stat-percent');

  if (!trackerList) return;

  // build tracker on load
  refreshTracker();

  function refreshTracker() {
    // load saved tracker data
    var visited = JSON.parse(localStorage.getItem('tracker_visited') || '[]');
    var planned = JSON.parse(localStorage.getItem('tracker_planned') || '[]');

    // update stat counters
    visitedCountEl.textContent = visited.length;
    plannedCountEl.textContent = planned.length;

    var total = travelDestinations.length;
    var percent = total > 0 ? Math.round((visited.length / total) * 100) : 0;
    percentEl.textContent = percent + '%';

    // clear and rebuild the tracker list
    trackerList.innerHTML = '';

    for (var i = 0; i < travelDestinations.length; i++) {
      var dest = travelDestinations[i];
      var isVisited = visited.indexOf(dest.id) !== -1;
      var isPlanned = planned.indexOf(dest.id) !== -1;

      var imgUrl = dest.image;
      if (imgUrl.indexOf('assets') === 0) imgUrl = '../' + imgUrl;

      var item = document.createElement('div');
      item.className = 'tracker-item';
      item.innerHTML =
        '<img src="' + imgUrl + '" alt="' + dest.name + '" class="tracker-thumb" onerror="this.src=\'../assets/placeholder.jpg\'">' +
        '<div class="tracker-info">' +
          '<div class="tracker-name">' + dest.name + '</div>' +
          '<div class="tracker-country">' + dest.country + ' | ' + dest.continent + '</div>' +
        '</div>' +
        '<div class="tracker-actions">' +
          '<button class="btn-track btn-track-visited ' + (isVisited ? 'active' : '') + '" title="' + (isVisited ? 'Unmark' : 'Mark as Visited') + '">✓</button>' +
          '<button class="btn-track btn-track-planned ' + (isPlanned ? 'active' : '') + '" title="' + (isPlanned ? 'Unmark' : 'Mark as Planned') + '">📅</button>' +
        '</div>';

      // attach button listeners using closure
      (function(destId, destName) {
        item.querySelector('.btn-track-visited').addEventListener('click', function() {
          toggleVisited(destId, destName);
        });
        item.querySelector('.btn-track-planned').addEventListener('click', function() {
          togglePlanned(destId, destName);
        });
      })(dest.id, dest.name);

      trackerList.appendChild(item);
    }
  }

  function toggleVisited(id, name) {
    var visited = JSON.parse(localStorage.getItem('tracker_visited') || '[]');
    var planned = JSON.parse(localStorage.getItem('tracker_planned') || '[]');

    var idx = visited.indexOf(id);
    if (idx !== -1) {
      visited.splice(idx, 1);
      if (window.showNotification) window.showNotification('Removed ' + name + ' from visited.', 'info');
    } else {
      visited.push(id);
      if (window.showNotification) window.showNotification(name + ' marked as visited!', 'success');
      // remove from planned if it was there
      var pIdx = planned.indexOf(id);
      if (pIdx !== -1) planned.splice(pIdx, 1);
    }

    localStorage.setItem('tracker_visited', JSON.stringify(visited));
    localStorage.setItem('tracker_planned', JSON.stringify(planned));
    refreshTracker();
  }

  function togglePlanned(id, name) {
    var visited = JSON.parse(localStorage.getItem('tracker_visited') || '[]');
    var planned = JSON.parse(localStorage.getItem('tracker_planned') || '[]');

    var idx = planned.indexOf(id);
    if (idx !== -1) {
      planned.splice(idx, 1);
      if (window.showNotification) window.showNotification('Removed ' + name + ' from planned.', 'info');
    } else {
      planned.push(id);
      if (window.showNotification) window.showNotification(name + ' added to planned trips!', 'success');
      // remove from visited if was there
      var vIdx = visited.indexOf(id);
      if (vIdx !== -1) visited.splice(vIdx, 1);
    }

    localStorage.setItem('tracker_visited', JSON.stringify(visited));
    localStorage.setItem('tracker_planned', JSON.stringify(planned));
    refreshTracker();
  }
}
