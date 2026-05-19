// feedback.js - faq accordion and feedback form validation
// form saves to localStorage, no server needed

document.addEventListener('DOMContentLoaded', function() {
  setupFaqAccordion();
  setupFeedbackForm();
});

// simple accordion for the FAQ section
function setupFaqAccordion() {
  var headers = document.querySelectorAll('.faq-header');

  for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('click', function() {
      var item = this.parentElement;
      var body = item.querySelector('.faq-body');
      var isOpen = item.classList.contains('is-open');

      // close all other faq items first
      var allItems = document.querySelectorAll('.faq-item');
      for (var j = 0; j < allItems.length; j++) {
        if (allItems[j] !== item) {
          allItems[j].classList.remove('is-open');
          allItems[j].querySelector('.faq-body').style.maxHeight = '0px';
        }
      }

      // toggle the clicked item
      if (isOpen) {
        item.classList.remove('is-open');
        body.style.maxHeight = '0px';
      } else {
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  }
}

// feedback form with basic validation
function setupFeedbackForm() {
  var form = document.getElementById('feedback-form');
  if (!form) return;

  var nameInput = document.getElementById('fb-name');
  var emailInput = document.getElementById('fb-email');
  var messageInput = document.getElementById('fb-message');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // clear previous error states
    clearErrors();

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var message = messageInput.value.trim();

    var hasError = false;

    // validate name - at least 3 chars
    if (name.length < 3) {
      markError('group-name');
      hasError = true;
    }

    // basic email check - must have @ and a dot
    if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      markError('group-email');
      hasError = true;
    }

    // message needs to be at least 15 chars
    if (message.length < 15) {
      markError('group-message');
      hasError = true;
    }

    if (hasError) {
      if (window.showNotification) {
        window.showNotification('Please fix the errors before submitting.', 'error');
      }
      return;
    }

    // build the feedback object to save
    var feedbackEntry = {
      id: 'fb_' + Date.now(),
      name: name,
      email: email,
      message: message,
      date: new Date().toLocaleDateString()
    };

    // get existing submissions
    var stored = localStorage.getItem('feedback_submissions');
    var all = [];
    if (stored) {
      all = JSON.parse(stored);
    }

    // add new one and save back
    all.push(feedbackEntry);
    localStorage.setItem('feedback_submissions', JSON.stringify(all));

    if (window.showNotification) {
      window.showNotification('Thanks ' + name + '! Your feedback was submitted.', 'success');
    }

    form.reset();
  });

  // adds the has-error class to highlight a field
  function markError(groupId) {
    var group = document.getElementById(groupId);
    if (group) group.classList.add('has-error');
  }

  // clears all error highlighting
  function clearErrors() {
    var groups = document.querySelectorAll('.form-group');
    for (var i = 0; i < groups.length; i++) {
      groups[i].classList.remove('has-error');
    }
  }
}
