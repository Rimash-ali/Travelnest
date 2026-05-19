// travelnest travel mood track and list tracker

document.addEventListener('DOMContentLoaded', () => {
  initAmbientSounds();
  initTravelTracker();
});

// controls playback of ocean beach and forest background noises
function initAmbientSounds() {
  const toggleBtns = document.querySelectorAll('.play-toggle-btn');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const soundType = btn.getAttribute('data-sound');
      const card = document.getElementById(`sound-card-${soundType}`);
      const audio = document.getElementById(`audio-${soundType}`);
      
      if (!audio || !card) return;

      const isPlaying = card.classList.contains('is-active') || card.classList.contains('is-playing');

      // mute other sounds so they dont mix
      pauseAllSounds(soundType);

      if (isPlaying) {
        // pause it
        audio.pause();
        card.classList.remove('is-playing');
        btn.innerHTML = `Play Sound`;
        
        if (window.showNotification) {
          window.showNotification(`Ambient sound paused.`, 'info', 2000);
        }
      } else {
        // play audio stream
        audio.play()
          .then(() => {
            card.classList.add('is-playing');
            btn.innerHTML = `Pause Sound`;
            if (window.showNotification) {
              window.showNotification(`Playing ambient ${soundType} soundtrack.`, 'success', 2000);
            }
          })
          .catch(err => {
            console.error("Audio playback blocked or failed:", err);
            // fallback if audio fails/blocked by browser permissions
            card.classList.add('is-playing');
            btn.innerHTML = `Pause (Muted Demo)`;
            if (window.showNotification) {
              window.showNotification(`Audio blocked by browser. Equalizer running in demo mode.`, 'info');
            }
          });
      }
    });
  });

  // stop all currently running sounds
  function pauseAllSounds(exceptType) {
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
      const type = audio.id.replace('audio-', '');
      if (type !== exceptType) {
        audio.pause();
        const card = document.getElementById(`sound-card-${type}`);
        const btn = document.querySelector(`.play-toggle-btn[data-sound="${type}"]`);
        
        if (card) card.classList.remove('is-playing');
        if (btn) btn.innerHTML = `Play Sound`;
      }
    });
  }
}

// tracker section for checking off visited/planned destinations
function initTravelTracker() {
  const trackerList = document.getElementById('tracker-list');
  const countVisitedEl = document.getElementById('stat-visited-count');
  const countPlannedEl = document.getElementById('stat-planned-count');
  const percentEl = document.getElementById('stat-percent');

  if (!trackerList) return;

  // render list and count statistics
  updateStatsAndList();

  function updateStatsAndList() {
    // 1. Fetch current logs from storage
    let visited = [];
    let planned = [];

    const vStored = localStorage.getItem('tracker_visited');
    const pStored = localStorage.getItem('tracker_planned');
    visited = vStored ? JSON.parse(vStored) : [];
    planned = pStored ? JSON.parse(pStored) : [];

    // update UI text stats
    const totalDests = travelDestinations.length;
    countVisitedEl.textContent = visited.length;
    countPlannedEl.textContent = planned.length;
    
    const percentage = totalDests > 0 ? Math.round((visited.length / totalDests) * 100) : 0;
    percentEl.textContent = `${percentage}%`;

    // display tracker items in the DOM
    trackerList.innerHTML = '';
    
    travelDestinations.forEach(dest => {
      const isVisited = visited.includes(dest.id);
      const isPlanned = planned.includes(dest.id);

      const imgUrl = dest.image.startsWith('assets') ? '../' + dest.image : dest.image;
      const item = document.createElement('div');
      item.className = 'tracker-item';
      item.innerHTML = `
        <img src="${imgUrl}" alt="${dest.name}" class="tracker-thumb" onerror="this.src='../assets/placeholder.jpg'">
        <div class="tracker-info">
          <div class="tracker-name">${dest.name}</div>
          <div class="tracker-country">${dest.country} | ${dest.continent}</div>
        </div>
        <div class="tracker-actions">
          <button class="btn-track btn-track-visited ${isVisited ? 'active' : ''}" title="${isVisited ? 'Unmark Visited' : 'Mark Visited'}" data-id="${dest.id}" style="display:flex;align-items:center;justify-content:center;">
            <img src="../assets/icons/marker-visited.png" alt="Visited" style="width:14px;height:14px;object-fit:contain;">
          </button>
          <button class="btn-track btn-track-planned ${isPlanned ? 'active' : ''}" title="${isPlanned ? 'Unmark Planned' : 'Mark Planned'}" data-id="${dest.id}" style="display:flex;align-items:center;justify-content:center;">
            <img src="../assets/icons/marker-planned.png" alt="Planned" style="width:14px;height:14px;object-fit:contain;">
          </button>
        </div>
      `;

      // visited toggle logic
      const visitedBtn = item.querySelector('.btn-track-visited');
      visitedBtn.addEventListener('click', () => {
        toggleVisited(dest.id, dest.name);
      });

      // planned toggle logic
      const plannedBtn = item.querySelector('.btn-track-planned');
      plannedBtn.addEventListener('click', () => {
        togglePlanned(dest.id, dest.name);
      });

      trackerList.appendChild(item);
    });
  }

  // toggle selected destination ID in visited storage
  function toggleVisited(id, name) {
    let visited = [];
    let planned = [];

    visited = JSON.parse(localStorage.getItem('tracker_visited') || '[]');
    planned = JSON.parse(localStorage.getItem('tracker_planned') || '[]');

    const index = visited.indexOf(id);
    if (index > -1) {
      visited.splice(index, 1);
      if (window.showNotification) {
        window.showNotification(`Removed ${name} from visited list.`, 'info');
      }
    } else {
      visited.push(id);
      if (window.showNotification) {
        window.showNotification(`Awesome! Marked ${name} as visited.`, 'success');
      }
      // auto remove from planned array if it's now visited
      const pIndex = planned.indexOf(id);
      if (pIndex > -1) {
        planned.splice(pIndex, 1);
      }
    }

    // save updated stats to localstorage
    localStorage.setItem('tracker_visited', JSON.stringify(visited));
    localStorage.setItem('tracker_planned', JSON.stringify(planned));

    updateStatsAndList();
  }

  // toggle selected destination ID in planned storage
  function togglePlanned(id, name) {
    let visited = [];
    let planned = [];

    visited = JSON.parse(localStorage.getItem('tracker_visited') || '[]');
    planned = JSON.parse(localStorage.getItem('tracker_planned') || '[]');

    const index = planned.indexOf(id);
    if (index > -1) {
      planned.splice(index, 1);
      if (window.showNotification) {
        window.showNotification(`Removed ${name} from planned list.`, 'info');
      }
    } else {
      planned.push(id);
      if (window.showNotification) {
        window.showNotification(`Added ${name} to planned itineraries.`, 'success');
      }
      // Auto remove from visited array since it a future planned trip!
      const vIndex = visited.indexOf(id);
      if (vIndex > -1) {
        visited.splice(vIndex, 1);
      }
    }

    // Save back to storage
    localStorage.setItem('tracker_visited', JSON.stringify(visited));
    localStorage.setItem('tracker_planned', JSON.stringify(planned));

    updateStatsAndList();
  }
}
