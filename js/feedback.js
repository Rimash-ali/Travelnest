// travelnest feedback and faq accordion page script

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initFormValidation();
});

// handles opening/closing faq accordion slides
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      const isOpen = item.classList.contains('is-open');

      // close other panels so only one is open
      collapseAllFaqs(item);

      if (isOpen) {
        item.classList.remove('is-open');
        body.style.maxHeight = '0px';
      } else {
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  function collapseAllFaqs(exceptItem = null) {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      if (item !== exceptItem && item.classList.contains('is-open')) {
        item.classList.remove('is-open');
        item.querySelector('.faq-body').style.maxHeight = '0px';
      }
    });
  }
}

// handles local validation checks before submitting the feedback
function initFormValidation() {
  const form = document.getElementById('feedback-form');
  const nameInput = document.getElementById('fb-name');
  const emailInput = document.getElementById('fb-email');
  const messageInput = document.getElementById('fb-message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // clear previous error marks
    resetErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let hasErrors = false;

    // name validation
    if (!name || name.length < 3) {
      setError('group-name');
      hasErrors = true;
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('group-email');
      hasErrors = true;
    }

    // message content validation
    if (!message || message.length < 15) {
      setError('group-message');
      hasErrors = true;
    }

    if (hasErrors) {
      if (window.showNotification) {
        window.showNotification('Please correct the highlighted fields in red before submitting.', 'error');
      }
      return;
    }

    // make feedback submit entry
    const feedbackSubmission = {
      id: 'fb_' + Date.now(),
      name: name,
      email: email,
      message: message,
      submittedAt: new Date().toISOString()
    };

    // read and write to local list
    let savedFeedback = [];
    const stored = localStorage.getItem('feedback_submissions');
    savedFeedback = stored ? JSON.parse(stored) : [];

    savedFeedback.push(feedbackSubmission);

    let success = false;
    try {
      localStorage.setItem('feedback_submissions', JSON.stringify(savedFeedback));
      success = true;
    } catch (err) {
      console.error(err);
    }

    if (success) {
      if (window.showNotification) {
        window.showNotification('Thank you! Your feedback has been logged in our systems.', 'success');
      } else {
        alert('Feedback submitted successfully!');
      }
      form.reset();
    } else {
      if (window.showNotification) {
        window.showNotification('Failed to log feedback. Storage space error.', 'error');
      }
    }
  });

  function setError(groupId) {
    const group = document.getElementById(groupId);
    if (group) {
      group.classList.add('has-error');
    }
  }

  function resetErrors() {
    const groups = document.querySelectorAll('.form-group');
    groups.forEach(g => g.classList.remove('has-error'));
  }
}
