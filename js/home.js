// travelnest home page script
// this handles quote rotation, the destnation of the day spotlight, and newsletter subscribtion

document.addEventListener("DOMContentLoaded", () => {
  initQuoteRotation();
  initDestinationOfTheDay();
  initNewsletterForm();
});

// quotes carosel rotate function so the homepage feels alive
function initQuoteRotation() {
  const quoteContainer = document.getElementById("quote-slider");
  if (!quoteContainer) return;

  const quoteText = quoteContainer.querySelector(".quote-text");
  const quoteAuthor = quoteContainer.querySelector(".quote-author");

  let currentQuoteIndex = 0;

  // show the first quote right away
  displayQuote(currentQuoteIndex);

  // rotate quotes every 6 seconds
  setInterval(() => {
    // fade it out first
    quoteContainer.style.opacity = "0";

    setTimeout(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % travelQuotes.length;
      displayQuote(currentQuoteIndex);
      // fade back in
      quoteContainer.style.opacity = "1";
    }, 500); // half sec delay for animation
  }, 6000);

  function displayQuote(index) {
    const quote = travelQuotes[index];
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `- ${quote.author}`;
  }
}

// spotlight of the day, updates dynamically depending on the calendar date using modulo
function initDestinationOfTheDay() {
  const dodContainer = document.getElementById("dod-container");
  if (!dodContainer || !travelDestinations || travelDestinations.length === 0)
    return;

  // get a determnistic index using date so it only changes once a day
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const date = now.getDate(); // 1-31

  // simple date hash math
  const dateSum = year + month + date;
  const destinationIndex = dateSum % travelDestinations.length;
  const dod = travelDestinations[destinationIndex];

  // render card html dynamically
  dodContainer.innerHTML = `
    <div class="dod-card">
      <img src="${dod.image}" alt="${dod.name}" class="dod-img" onerror="this.src='assets/placeholder.jpg'">
      <div class="dod-content">
        <span class="dod-badge" style="display:inline-flex;align-items:center;gap:4.5px;">
          <img src="assets/icons/logo.png" alt="Spotlight" style="width:12px;height:12px;object-fit:contain;">
          Destination of the Day
        </span>
        <h3 class="dod-title">${dod.name}, ${dod.country}</h3>
        <div class="dod-meta">
          <span style="display:inline-flex;align-items:center;gap:6px;">
            <img src="assets/icons/world-globe.png" alt="Continent" style="width:14px;height:14px;object-fit:contain;">
            ${dod.continent}
          </span>
          <span style="display:inline-flex;align-items:center;gap:6px;">
            <img src="assets/icons/explorer.png" alt="Vibe" style="width:14px;height:14px;object-fit:contain;">
            ${dod.travelType.toUpperCase()}
          </span>
          <span style="display:inline-flex;align-items:center;gap:6px;">
            <img src="assets/icons/wallet-cost.png" alt="Budget" style="width:14px;height:14px;object-fit:contain;">
            ${dod.budgetRange.toUpperCase()} BUDGET
          </span>
        </div>
        <p class="dod-desc">${dod.description}</p>
        <div style="margin-top: 10px;">
          <a href="./pages/explorer.html?id=${dod.id}" class="btn btn-primary">
            Explore Destination →
          </a>
        </div>
      </div>
    </div>
  `;
}

// save the users email in local storage for newsletter updates
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");

  if (!form || !emailInput) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      if (window.showNotification) {
        window.showNotification("Please enter a valid email address.", "error");
      } else {
        alert("Please enter a valid email address.");
      }
      return;
    }

    // get saved emails from storage or make empty array
    let emails = [];
    const stored = localStorage.getItem("newsletter_emails");
    emails = stored ? JSON.parse(stored) : [];

    // prevent duplicate subscriptions
    if (emails.includes(email)) {
      if (window.showNotification) {
        window.showNotification(
          "You have already subscribed with this email!",
          "info",
        );
      } else {
        alert("You are already subscribed!");
      }
      form.reset();
      return;
    }

    // add to the list and save it
    emails.push(email);

    let saved = false;
    try {
      localStorage.setItem("newsletter_emails", JSON.stringify(emails));
      saved = true;
    } catch (err) {
      console.error(err);
    }

    if (saved) {
      if (window.showNotification) {
        window.showNotification(
          "Thank you for subscribing! Your wanderlust digests are on their way.",
          "success",
        );
      } else {
        alert("Subscribed successfully!");
      }
      form.reset();
    } else {
      if (window.showNotification) {
        window.showNotification(
          "Failed to subscribe. Please try again.",
          "error",
        );
      }
    }
  });
}
