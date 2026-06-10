// budget.js - trip budget calculator and saved plans
// lets user estimate total trip cost and save plans to localStorage

document.addEventListener('DOMContentLoaded', function() {
  setupBudgetPlanner();
});

function setupBudgetPlanner() {
  var form = document.getElementById('budget-form');
  var destSelect = document.getElementById('budget-destination');
  var daysInput = document.getElementById('budget-days');
  var dailyInput = document.getElementById('budget-daily');
  var resultPanel = document.getElementById('result-panel');
  var totalAmountEl = document.getElementById('total-amount');
  var statusBadgeEl = document.getElementById('status-badge');
  var progressFill = document.getElementById('progress-fill');
  var percentEl = document.getElementById('tier-percent');
  var labelLow = document.getElementById('label-low');
  var labelMod = document.getElementById('label-mod');
  var labelLux = document.getElementById('label-lux');
  var saveBtn = document.getElementById('save-budget-btn');
  var savedList = document.getElementById('saved-plans-list');

  // stores the last calculation result so we can save it
  var lastCalc = null;

  // fill destination dropdown from data.js array
  // (Removed - now handled directly in HTML to reduce JS complexity)

  // load saved plans from storage on page load
  renderSavedPlans();

  // form submit handler - calculate the budget
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var destId = destSelect.value;
      var days = parseInt(daysInput.value);
      var daily = parseFloat(dailyInput.value);

      // simple validation
      if (!destId || isNaN(days) || isNaN(daily) || days <= 0 || daily <= 0) {
        if (window.showNotification) {
          window.showNotification('Please fill in all fields correctly.', 'error');
        }
        return;
      }

      // find the selected destination in the array
      var dest = null;
      for (var i = 0; i < travelDestinations.length; i++) {
        if (travelDestinations[i].id === destId) {
          dest = travelDestinations[i];
          break;
        }
      }
      if (!dest) return;

      // calc daily costs for each tier from the destination data
      var lowDaily = dest.costs.budget.accommodation + dest.costs.budget.food + dest.costs.budget.transport;
      var modDaily = dest.costs.moderate.accommodation + dest.costs.moderate.food + dest.costs.moderate.transport;
      var luxDaily = dest.costs.luxury.accommodation + dest.costs.luxury.food + dest.costs.luxury.transport;

      var totalCost = days * daily;

      // work out which tier the user falls into
      var status = '';
      var statusClass = '';
      if (daily < modDaily * 0.85) {
        status = 'Low Budget (Backpacker)';
        statusClass = 'status-low';
      } else if (daily < luxDaily * 0.8) {
        status = 'Moderate Budget (Comfort)';
        statusClass = 'status-moderate';
      } else {
        status = 'Luxury Budget (Premium)';
        statusClass = 'status-luxury';
      }

      // percentage for progress bar
      var maxVal = luxDaily * 1.3;
      var percent = Math.round((daily / maxVal) * 100);
      if (percent > 100) percent = 100;

      // save calculation data so we can save it later
      lastCalc = {
        id: 'plan_' + Date.now(),
        destId: dest.id,
        destName: dest.name,
        country: dest.country,
        days: days,
        dailyBudget: daily,
        totalCost: totalCost,
        status: status,
        statusClass: statusClass
      };

      // show the results
      showResults(totalCost, status, statusClass, percent, lowDaily, modDaily, luxDaily);
    });
  }

  // save button click - adds plan to localStorage list
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      if (!lastCalc) return;

      var stored = localStorage.getItem('saved_budgets');
      var plans = [];
      if (stored) {
        try {
          plans = JSON.parse(stored);
        } catch (err) {
          plans = [];
        }
      }

      plans.unshift(lastCalc); // add at the beginning
      localStorage.setItem('saved_budgets', JSON.stringify(plans));

      if (window.showNotification) {
        window.showNotification('Budget plan for ' + lastCalc.destName + ' saved!', 'success');
      }

      renderSavedPlans();

      // reset the form
      form.reset();
      resultPanel.style.display = 'none';
      lastCalc = null;
    });
  }

  // shows the result panel with all calculated values
  function showResults(total, status, statusClass, percent, low, mod, lux) {
    resultPanel.style.display = 'flex';

    // just set the total directly, no animation needed
    totalAmountEl.textContent = '$' + total.toLocaleString();

    // update status badge class and text
    statusBadgeEl.className = 'status-badge ' + statusClass;
    statusBadgeEl.textContent = status;

    // update progress bar width
    progressFill.style.width = percent + '%';
    percentEl.textContent = percent + '%';

    // tier labels below the progress bar
    labelLow.textContent = 'Budget ($' + low + ')';
    labelMod.textContent = 'Moderate ($' + mod + ')';
    labelLux.textContent = 'Luxury ($' + lux + ')';
  }

  // reads localStorage and renders all saved plans
  function renderSavedPlans() {
    if (!savedList) return;

    var stored = localStorage.getItem('saved_budgets');
    var plans = [];
    if (stored) {
      try {
        plans = JSON.parse(stored);
      } catch (err) {
        plans = [];
      }
    }

    savedList.innerHTML = '';

    if (plans.length === 0) {
      savedList.innerHTML = '<div class="no-plans"><p>No plans saved yet. Fill out the calculator to save your first budget.</p></div>';
      return;
    }

    // render each saved plan as a card
    for (var i = 0; i < plans.length; i++) {
      var plan = plans[i];
      var card = document.createElement('div');
      card.className = 'saved-plan-card';
      card.innerHTML =
        '<div class="saved-plan-info">' +
          '<div class="saved-plan-dest">' + plan.destName + ', ' + plan.country + '</div>' +
          '<div class="saved-plan-meta">' + plan.days + ' days &nbsp;|&nbsp; $' + plan.dailyBudget + '/day</div>' +
        '</div>' +
        '<div style="display:flex; align-items:center; gap:12px;">' +
          '<div class="saved-plan-cost">$' + plan.totalCost.toLocaleString() + '</div>' +
          '<button class="delete-btn" data-id="' + plan.id + '" title="Delete this plan" aria-label="Delete budget plan for ' + plan.destName + '">✕</button>' +
        '</div>';

      // add delete functionality using a closure to capture correct plan
      (function(planId, planName) {
        card.querySelector('.delete-btn').addEventListener('click', function(e) {
          e.stopPropagation();
          deletePlan(planId, planName);
        });
      })(plan.id, plan.destName);

      savedList.appendChild(card);
    }
  }

  // removes a single saved plan by id
  function deletePlan(id, name) {
    var stored = localStorage.getItem('saved_budgets');
    var plans = [];
    if (stored) {
      try {
        plans = JSON.parse(stored);
      } catch (err) {
        plans = [];
      }
    }

    // rebuild array without the deleted one
    var updated = [];
    for (var i = 0; i < plans.length; i++) {
      if (plans[i].id !== id) {
        updated.push(plans[i]);
      }
    }

    localStorage.setItem('saved_budgets', JSON.stringify(updated));

    if (window.showNotification) {
      window.showNotification('Deleted plan for ' + name + '.', 'info');
    }
    renderSavedPlans();
  }
}
