// travelnest budget page. calculates and saves budget projections

document.addEventListener("DOMContentLoaded", () => {
  initBudgetPlanner();
});

function initBudgetPlanner() {
  const form = document.getElementById("budget-form");
  const destSelect = document.getElementById("budget-destination");
  const daysInput = document.getElementById("budget-days");
  const dailyInput = document.getElementById("budget-daily");

  const resultPanel = document.getElementById("result-panel");
  const totalAmountEl = document.getElementById("total-amount");
  const statusBadgeEl = document.getElementById("status-badge");
  const progressFillEl = document.getElementById("progress-fill");
  const percentEl = document.getElementById("tier-percent");

  const labelLow = document.getElementById("label-low");
  const labelMod = document.getElementById("label-mod");
  const labelLux = document.getElementById("label-lux");

  const saveBtn = document.getElementById("save-budget-btn");
  const savedPlansList = document.getElementById("saved-plans-list");

  // keep track of current budget calculation for saving
  let currentCalculation = null;

  // add destnations options to select dropdown
  if (destSelect && travelDestinations) {
    travelDestinations.forEach((dest) => {
      const opt = document.createElement("option");
      opt.value = dest.id;
      opt.textContent = `${dest.name} (${dest.country})`;
      destSelect.appendChild(opt);
    });
  }

  // load saved plans from localstorage
  renderSavedPlans();

  // submit form action
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const destId = destSelect.value;
      const days = parseInt(daysInput.value, 10);
      const dailyBudget = parseFloat(dailyInput.value);

      if (
        !destId ||
        isNaN(days) ||
        isNaN(dailyBudget) ||
        days <= 0 ||
        dailyBudget <= 0
      ) {
        if (window.showNotification) {
          window.showNotification(
            "Please fill in all details with positive values.",
            "error",
          );
        }
        return;
      }

      // find destination in data
      const dest = travelDestinations.find((d) => d.id === destId);
      if (!dest) return;

      // get budget tier limits
      const lowCost =
        dest.costs.budget.accommodation +
        dest.costs.budget.food +
        dest.costs.budget.transport;
      const modCost =
        dest.costs.moderate.accommodation +
        dest.costs.moderate.food +
        dest.costs.moderate.transport;
      const luxCost =
        dest.costs.luxury.accommodation +
        dest.costs.luxury.food +
        dest.costs.luxury.transport;

      const totalCost = days * dailyBudget;

      // decide budget status tier
      let status = "";
      let statusClass = "";

      if (dailyBudget < modCost * 0.85) {
        status = "Low Budget (Backpacker)";
        statusClass = "status-low";
      } else if (dailyBudget >= modCost * 0.85 && dailyBudget < luxCost * 0.8) {
        status = "Moderate Budget (Comfort)";
        statusClass = "status-moderate";
      } else {
        status = "Luxury Budget (Premium)";
        statusClass = "status-luxury";
      }

      // calculate progress bar percent
      const maxRangeVal = luxCost * 1.3; // Cap progress scale slightly above luxury
      const progressPercent = Math.min(
        100,
        Math.round((dailyBudget / maxRangeVal) * 100),
      );

      // store object details to save later
      currentCalculation = {
        id: "plan_" + Date.now(),
        destId: dest.id,
        destName: dest.name,
        country: dest.country,
        days: days,
        dailyBudget: dailyBudget,
        totalCost: totalCost,
        status: status,
        statusClass: statusClass,
      };

      // show calculations and trigger count animations
      displayResults(
        totalCost,
        status,
        statusClass,
        progressPercent,
        lowCost,
        modCost,
        luxCost,
      );
    });
  }

  // handle plan saving click
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (!currentCalculation) return;

      let savedPlans = [];
      const stored = localStorage.getItem("saved_budgets");
      savedPlans = stored ? JSON.parse(stored) : [];

      // add plan to the array
      savedPlans.unshift(currentCalculation); // Add to beginning

      let success = false;
      try {
        localStorage.setItem("saved_budgets", JSON.stringify(savedPlans));
        success = true;
      } catch (e) {
        console.error(e);
      }

      if (success) {
        if (window.showNotification) {
          window.showNotification(
            `Saved budget plan for ${currentCalculation.destName}!`,
            "success",
          );
        }
        renderSavedPlans();

        // clear inputs and state
        form.reset();
        resultPanel.style.display = "none";
        currentCalculation = null;
      } else {
        if (window.showNotification) {
          window.showNotification(
            "Could not save budget plan. Storage full?",
            "error",
          );
        }
      }
    });
  }

  // display calculated results on page
  function displayResults(
    total,
    status,
    statusClass,
    percentage,
    low,
    mod,
    lux,
  ) {
    // Show panel
    resultPanel.style.display = "flex";

    // Animate Counter for Total Cost
    animateCounter(totalAmountEl, total);

    // Set Status Badge classes
    statusBadgeEl.className = `status-badge ${statusClass}`;
    statusBadgeEl.innerHTML = ` ${status}`;

    // Set Progress fill width and percent text
    progressFillEl.style.width = "0%";
    percentEl.textContent = "0%";

    setTimeout(() => {
      progressFillEl.style.width = `${percentage}%`;
      percentEl.textContent = `${percentage}%`;
    }, 100);

    // Set low, moderate, luxury indicators
    labelLow.textContent = `Budget ($${low})`;
    labelMod.textContent = `Moderate ($${mod})`;
    labelLux.textContent = `Luxury ($${lux})`;
  }

  // simple count-up animation function for costs
  function animateCounter(element, targetValue) {
    let start = 0;
    const end = targetValue;
    const duration = 800; // milliseconds
    const stepTime = Math.abs(Math.floor(duration / (end / 10 || 1)));

    // Safety cap for step time to avoid freezing
    const actualStepTime = Math.max(stepTime, 20);

    element.textContent = "$0";

    const timer = setInterval(() => {
      // Linear step increment (speed adjusts based on target value)
      const increment = Math.ceil(end / 25);
      start += increment;

      if (start >= end) {
        element.textContent = `$${end.toLocaleString()}`;
        clearInterval(timer);
      } else {
        element.textContent = `$${start.toLocaleString()}`;
      }
    }, actualStepTime);
  }

  // load and show saved plans from storage
  function renderSavedPlans() {
    if (!savedPlansList) return;

    let savedPlans = [];
    const stored = localStorage.getItem("saved_budgets");
    savedPlans = stored ? JSON.parse(stored) : [];

    savedPlansList.innerHTML = "";

    if (savedPlans.length === 0) {
      savedPlansList.innerHTML = `
        <div class="no-plans">
          <div class="plans-icon" style="display:flex;justify-content:center;margin-bottom:12px;">
            <img src="../assets/icons/empty-budget.png" alt="No plans saved" style="width:48px;height:48px;object-fit:contain;">
          </div>
          <p>No plans saved yet. Fill out the calculator to save your first budget.</p>
        </div>
      `;
      return;
    }

    savedPlans.forEach((plan) => {
      const card = document.createElement("div");
      card.className = "saved-plan-card";
      card.innerHTML = `
        <div class="saved-plan-info">
          <div class="saved-plan-dest">${plan.destName}, ${plan.country}</div>
          <div class="saved-plan-meta" style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;align-items:center;gap:6px;">
              <img src="../assets/icons/calendar-days.png" alt="Days" style="width:12px;height:12px;object-fit:contain;">
              ${plan.days} Days
            </span> | 
            <span style="display:inline-flex;align-items:center;gap:6px;">
              <img src="../assets/icons/daily-cost.png" alt="Daily Budget" style="width:12px;height:12px;object-fit:contain;">
              $${plan.dailyBudget}/day
            </span>
          </div>
          <div style="margin-top: 6px;">
            <span class="status-badge ${plan.statusClass}" style="margin: 0; padding: 2px 10px; font-size: 0.7rem;">${plan.status.split(" ")[0]}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="saved-plan-cost">$${plan.totalCost.toLocaleString()}</div>
          <button class="delete-btn" data-id="${plan.id}" title="Delete Plan">
            <img src="../assets/icons/delete-trash.png" alt="Delete" style="width:14px;height:14px;object-fit:contain;">
          </button>
        </div>
      `;

      // delete plan when trash clicked
      const delBtn = card.querySelector(".delete-btn");
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deletePlan(plan.id, plan.destName);
      });

      savedPlansList.appendChild(card);
    });
  }

  // remove selected plan from the array
  function deletePlan(id, name) {
    let savedPlans = [];
    const stored = localStorage.getItem("saved_budgets");
    savedPlans = stored ? JSON.parse(stored) : [];

    const filtered = savedPlans.filter((p) => p.id !== id);

    let success = false;
    try {
      localStorage.setItem("saved_budgets", JSON.stringify(filtered));
      success = true;
    } catch (e) {
      console.error(e);
    }

    if (success) {
      if (window.showNotification) {
        window.showNotification(`Deleted budget plan for ${name}.`, "info");
      }
      renderSavedPlans();
    } else {
      if (window.showNotification) {
        window.showNotification(
          "Could not delete plan. Try clearing browser cache.",
          "error",
        );
      }
    }
  }
}
