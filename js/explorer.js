// explorer page script. filters destnations and displays them

document.addEventListener("DOMContentLoaded", () => {
  initExplorer();
});

function initExplorer() {
  // html elements we need
  const searchInput = document.getElementById("search-name");
  const typeSelect = document.getElementById("select-type");
  const continentPillsContainer = document.getElementById("continent-pills");
  const explorerGrid = document.getElementById("explorer-grid");

  const modal = document.getElementById("details-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  // modal text elements
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalMeta = document.getElementById("modal-meta");
  const modalDesc = document.getElementById("modal-desc");
  const modalAttractions = document.getElementById("modal-attractions");
  const modalCostsTbody = document.getElementById("modal-costs-tbody");

  // recipe section details
  const modalRecipeName = document.getElementById("modal-recipe-name");
  const modalRecipeDiff = document.getElementById("modal-recipe-diff");
  const modalRecipePrep = document.getElementById("modal-recipe-prep");
  const modalRecipeDesc = document.getElementById("modal-recipe-desc");

  // workout section details
  const modalWorkoutName = document.getElementById("modal-workout-name");
  const modalWorkoutIntensity = document.getElementById(
    "modal-workout-intensity",
  );
  const modalWorkoutCalories = document.getElementById(
    "modal-workout-calories",
  );
  const modalWorkoutDesc = document.getElementById("modal-workout-desc");

  // keep track of filters chosen
  let activeContinent = "all";
  let activeSearchQuery = "";
  let activeExperience = "all";

  // run initial card load
  renderCards();

  // deep-linking checks: if id url param is set, popup the modal
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get("id");
  if (targetId) {
    const targetDest = travelDestinations.find((d) => d.id === targetId);
    if (targetDest) {
      openModal(targetDest);
    }
  }

  // event listeners to trigger filters on user input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearchQuery = e.target.value.toLowerCase().trim();
      renderCards();
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener("change", (e) => {
      activeExperience = e.target.value;
      renderCards();
    });
  }

  if (continentPillsContainer) {
    const pills = continentPillsContainer.querySelectorAll(".pill");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        // toggle active class for pills
        pills.forEach((p) => p.classList.remove("is-active"));
        pill.classList.add("is-active");

        activeContinent = pill.getAttribute("data-continent");
        renderCards();
      });
    });
  }

  // close the modal dialog when clicking button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    // close when clicking outside container
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Escape key to close modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeModal();
    }
  });

  // filter and render cards depending on selection
  function renderCards() {
    if (!explorerGrid) return;

    explorerGrid.innerHTML = "";

    const filtered = travelDestinations.filter((dest) => {
      // 1. filter by continent
      const matchesContinent =
        activeContinent === "all" || dest.continent === activeContinent;

      // 2. filter by style type
      const matchesExperience =
        activeExperience === "all" || dest.travelType === activeExperience;

      // 3. search filter matching country/name text
      const matchesSearch =
        activeSearchQuery === "" ||
        dest.name.toLowerCase().includes(activeSearchQuery) ||
        dest.country.toLowerCase().includes(activeSearchQuery);

      return matchesContinent && matchesExperience && matchesSearch;
    });

    if (filtered.length === 0) {
      explorerGrid.innerHTML = `
        <div class="no-results reveal-on-scroll revealed">
          <div style="margin-bottom: 16px; display: flex; justify-content: center;">
            <img src="../assets/icons/world-globe.png" alt="No Results" style="width:48px;height:48px;object-fit:contain;">
          </div>
          <h3>No Destinations Found</h3>
          <p>Try refining your search text or filters to find another getaway.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((dest) => {
      const card = document.createElement("div");
      card.className = "dest-card reveal-on-scroll revealed";

      const imgUrl = dest.image.startsWith("assets")
        ? "../" + dest.image
        : dest.image;

      card.innerHTML = `
        <div class="dest-img-box">
          <img src="${imgUrl}" alt="${dest.name}" class="dest-card-img" onerror="this.src='../assets/placeholder.jpg'">
          <span class="dest-type-badge">${dest.travelType}</span>
        </div>
        <div class="dest-info">
          <div class="dest-card-meta">
            <span style="display:inline-flex;align-items:center;gap:6px;">
              <img src="../assets/icons/world-globe.png" alt="Continent" style="width:14px;height:14px;object-fit:contain;">
              ${dest.continent}
            </span>
            <span style="display:inline-flex;align-items:center;gap:6px;">
              <img src="../assets/icons/wallet-cost.png" alt="Budget" style="width:14px;height:14px;object-fit:contain;">
              ${dest.budgetRange.toUpperCase()}
            </span>
          </div>
          <h3 class="dest-card-title">${dest.name}, ${dest.country}</h3>
          <p class="dest-card-desc">${dest.description}</p>
          <div class="dest-card-footer">
            <span>View Details</span>
            <span>→</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        openModal(dest);
      });

      explorerGrid.appendChild(card);
    });
  }

  // shows details popup modal with recipes and workouts
  function openModal(dest) {
    const imgUrl = dest.image.startsWith("assets")
      ? "../" + dest.image
      : dest.image;
    modalImg.src = imgUrl;
    modalImg.alt = dest.name;
    modalTitle.textContent = `${dest.name}, ${dest.country}`;

    modalMeta.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:6px;">
        <img src="../assets/icons/world-globe.png" alt="Continent" style="width:14px;height:14px;object-fit:contain;">
        ${dest.continent}
      </span>
      <span style="display:inline-flex;align-items:center;gap:6px;">
        <img src="../assets/icons/explorer.png" alt="Vibe" style="width:14px;height:14px;object-fit:contain;">
        ${dest.travelType.toUpperCase()}
      </span>
      <span style="display:inline-flex;align-items:center;gap:6px;">
        <img src="../assets/icons/wallet-cost.png" alt="Budget" style="width:14px;height:14px;object-fit:contain;">
        ${dest.budgetRange.toUpperCase()} BUDGET
      </span>
    `;

    modalDesc.textContent = dest.description;

    // fill in attractions list
    modalAttractions.innerHTML = "";
    dest.attractions.forEach((att) => {
      const li = document.createElement("li");
      li.innerHTML = `<span style="color:var(--accent-teal);margin-right:8px;font-weight:bold;">✓</span>${att}`;
      modalAttractions.appendChild(li);
    });

    // cost details table calculation
    modalCostsTbody.innerHTML = "";
    const tiers = ["budget", "moderate", "luxury"];

    tiers.forEach((tier) => {
      const costData = dest.costs[tier];
      const dailyTotal =
        costData.accommodation + costData.food + costData.transport;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="text-transform: capitalize; font-weight: 700;">${tier}</td>
        <td>$${costData.accommodation}/day</td>
        <td>$${costData.food}/day</td>
        <td>$${costData.transport}/day</td>
        <td style="color: var(--accent-blue); font-weight: 700;">$${dailyTotal}/day</td>
      `;
      modalCostsTbody.appendChild(tr);
    });

    // setup local recipes details
    if (dest.recipeData) {
      modalRecipeName.textContent = dest.recipeData.dishName;
      modalRecipeDiff.textContent = dest.recipeData.difficulty;
      modalRecipePrep.textContent = dest.recipeData.prepTime;
      modalRecipeDesc.textContent = `Instructions: ${dest.recipeData.instructions}`;
    } else {
      modalRecipeName.textContent = "N/A";
      modalRecipeDesc.textContent = "No specific recipe data available.";
    }

    // setup travel fitness activities
    if (dest.workoutData) {
      modalWorkoutName.textContent = dest.workoutData.activityName;
      modalWorkoutIntensity.textContent = dest.workoutData.intensity;
      modalWorkoutCalories.textContent = dest.workoutData.caloriesBurned;
      modalWorkoutDesc.textContent = `${dest.workoutData.description} (Duration: ${dest.workoutData.duration})`;
    } else {
      modalWorkoutName.textContent = "N/A";
      modalWorkoutDesc.textContent = "No workout activities registered.";
    }

    // open the dialog window
    modal.classList.add("is-active");
    document.body.style.overflow = "hidden"; // stop page body scrolling behind modal
  }

  // closes the dialog modal
  function closeModal() {
    modal.classList.remove("is-active");
    document.body.style.overflow = ""; // re-enable body scroll
  }
}
