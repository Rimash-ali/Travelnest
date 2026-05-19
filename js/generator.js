// travelnest random trip generator script

document.addEventListener("DOMContentLoaded", () => {
  initGenerator();
});

function initGenerator() {
  const surpriseBtn = document.getElementById("gen-surprise-btn");
  const typeSelect = document.getElementById("gen-type");
  const budgetSelect = document.getElementById("gen-budget");

  const loader = document.getElementById("gen-loader");
  const resultCard = document.getElementById("gen-result-card");

  // text fields inside result card
  const resultImg = document.getElementById("result-img");
  const resultTypeBadge = document.getElementById("result-type-badge");
  const resultFallbackBadge = document.getElementById("result-fallback-badge");
  const resultTitle = document.getElementById("result-title");
  const resultContinent = document.getElementById("result-continent");
  const resultBudget = document.getElementById("result-budget");
  const resultDesc = document.getElementById("result-description");

  const wishlistBtn = document.getElementById("add-wishlist-btn");
  const explorerLink = document.getElementById("explorer-link-btn");
  const wishlistContainer = document.getElementById("wishlist-container");

  let currentDestination = null;

  // run render on start to load wishlist
  renderWishlist();

  // trigger surprise selection click
  if (surpriseBtn) {
    surpriseBtn.addEventListener("click", () => {
      const type = typeSelect.value;
      const budget = budgetSelect.value;

      // hide previous result card, popup loader
      resultCard.style.display = "none";
      loader.style.display = "flex";
      surpriseBtn.disabled = true;

      // delay 1.2 seconds for dramatic effect
      setTimeout(() => {
        // Hide loader
        loader.style.display = "none";
        surpriseBtn.disabled = false;

        // select and show surprise option
        selectDestination(type, budget);
      }, 1200);
    });
  }

  // logic to filter matching options or fall back if none
  function selectDestination(type, budget) {
    // Attempt exact match
    let matches = travelDestinations.filter(
      (d) => d.travelType === type && d.budgetRange === budget,
    );
    let isFallback = false;

    if (matches.length === 0) {
      // fallback 1: look for matching experience style type
      matches = travelDestinations.filter((d) => d.travelType === type);
      isFallback = true;

      if (matches.length === 0) {
        // fallback 2: look for matching budget cost
        matches = travelDestinations.filter((d) => d.budgetRange === budget);

        if (matches.length === 0) {
          // fallback 3: pick any random choice
          matches = travelDestinations;
        }
      }
    }

    // select random item from matches list
    const randomIndex = Math.floor(Math.random() * matches.length);
    const selection = matches[randomIndex];
    currentDestination = selection;

    // show card info
    displayDestination(selection, isFallback);
  }

  // displays chosen destination card
  function displayDestination(dest, isFallback) {
    const imgUrl = dest.image.startsWith("assets")
      ? "../" + dest.image
      : dest.image;
    resultImg.src = imgUrl;
    resultImg.alt = dest.name;
    resultTitle.textContent = `${dest.name}, ${dest.country}`;
    resultTypeBadge.textContent = dest.travelType;

    resultContinent.innerHTML = ` ${dest.continent}`;
    resultBudget.innerHTML = ` ${dest.budgetRange.toUpperCase()} BUDGET`;
    resultDesc.textContent = dest.description;

    // Link to explorer page with ID query param
    explorerLink.href = `./explorer.html?id=${dest.id}`;

    // Fallback badge visibility
    if (isFallback) {
      resultFallbackBadge.textContent = "Recommended Alt Match";
      resultFallbackBadge.style.display = "block";
    } else {
      resultFallbackBadge.style.display = "none";
    }

    // Wishlist Button Icon reset based on existence
    updateWishlistButtonState(dest.id);

    // Show card
    resultCard.style.display = "block";
  }

  // checks if card is already in wishlist and updates heart button
  function updateWishlistButtonState(id) {
    let wishlist = [];
    const stored = localStorage.getItem("wishlist_destinations");
    wishlist = stored ? JSON.parse(stored) : [];

    const exists = wishlist.some((item) => item.id === id);
    if (exists) {
      wishlistBtn.innerHTML = `<img src="../assets/icons/heart-filled.png" alt="Heart" style="width:14px;height:14px;object-fit:contain;margin-right:6px;"> Wishlisted`;
      wishlistBtn.classList.remove("btn-primary");
      wishlistBtn.classList.add("btn-outline");
    } else {
      wishlistBtn.innerHTML = `<img src="../assets/icons/heart-outline.png" alt="Heart" style="width:14px;height:14px;object-fit:contain;margin-right:6px;"> Add to Wishlist`;
      wishlistBtn.classList.remove("btn-outline");
      wishlistBtn.classList.add("btn-primary");
    }
  }

  // click on heart button to add/remove
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
      if (!currentDestination) return;

      let wishlist = [];
      const stored = localStorage.getItem("wishlist_destinations");
      wishlist = stored ? JSON.parse(stored) : [];

      const index = wishlist.findIndex(
        (item) => item.id === currentDestination.id,
      );

      if (index > -1) {
        // delete from wishlist
        wishlist.splice(index, 1);
        localStorage.setItem(
          "wishlist_destinations",
          JSON.stringify(wishlist),
        );

        if (window.showNotification) {
          window.showNotification(
            `Removed ${currentDestination.name} from wishlist.`,
            "info",
          );
        }
      } else {
        // append to wishlist
        wishlist.push({
          id: currentDestination.id,
          name: currentDestination.name,
          country: currentDestination.country,
          image: currentDestination.image,
          continent: currentDestination.continent,
          travelType: currentDestination.travelType,
        });

        localStorage.setItem(
          "wishlist_destinations",
          JSON.stringify(wishlist),
        );

        if (window.showNotification) {
          window.showNotification(
            `Added ${currentDestination.name} to wishlist!`,
            "success",
          );
        }
      }

      updateWishlistButtonState(currentDestination.id);
      renderWishlist();
    });
  }

  // render wishlist sidebar content
  function renderWishlist() {
    if (!wishlistContainer) return;

    let wishlist = [];
    const stored = localStorage.getItem("wishlist_destinations");
    wishlist = stored ? JSON.parse(stored) : [];

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = `
        <div class="wishlist-empty">
          <div class="empty-heart" style="display:flex;justify-content:center;margin-bottom:12px;">
            <img src="../assets/icons/heart-outline.png" alt="Empty wishlist" style="width:48px;height:48px;object-fit:contain;">
          </div>
          <p>Your wishlist is empty. Generate a trip and click "Add to Wishlist" to save it.</p>
        </div>
      `;
      return;
    }

    wishlist.forEach((item) => {
      const el = document.createElement("div");
      el.className = "wishlist-item";

      const itemImgUrl = item.image.startsWith("assets")
        ? "../" + item.image
        : item.image;
      el.innerHTML = `
        <div class="wishlist-details" style="cursor: pointer;">
          <img src="${itemImgUrl}" alt="${item.name}" class="wishlist-thumb" onerror="this.src='../assets/placeholder.jpg'">
          <div class="wishlist-info">
            <h4>${item.name}</h4>
            <p>${item.country} | ${item.travelType.toUpperCase()}</p>
          </div>
        </div>
        <button class="wishlist-delete" data-id="${item.id}" title="Remove from Wishlist">
          <img src="../assets/icons/delete-trash.png" alt="Remove" style="width:14px;height:14px;object-fit:contain;">
        </button>
      `;

      // click wishlist item to go to explorer page
      const detailsNode = el.querySelector(".wishlist-details");
      detailsNode.addEventListener("click", () => {
        window.location.href = `./explorer.html?id=${item.id}`;
      });

      // remove item when trash clicked
      const delBtn = el.querySelector(".wishlist-delete");
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromWishlist(item.id, item.name);
      });

      wishlistContainer.appendChild(el);
    });
  }

  // helper function to delete item from wishlist
  function removeFromWishlist(id, name) {
    let wishlist = [];
    const stored = localStorage.getItem("wishlist_destinations");
    wishlist = stored ? JSON.parse(stored) : [];

    const filtered = wishlist.filter((item) => item.id !== id);

    let success = false;
    try {
      localStorage.setItem("wishlist_destinations", JSON.stringify(filtered));
      success = true;
    } catch (e) {
      console.error(e);
    }

    if (success) {
      if (window.showNotification) {
        window.showNotification(`Removed ${name} from wishlist.`, "info");
      }
      renderWishlist();

      // toggle display status if card currently shown
      if (currentDestination && currentDestination.id === id) {
        updateWishlistButtonState(id);
      }
    }
  }
}
