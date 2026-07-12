const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');
const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidPhone = (value) => /^\d{7,15}$/.test(value);

const showMessage = (input, message) => {
  const feedback = input.parentElement.querySelector('.error-message');
  if (feedback) {
    feedback.textContent = message;
  }
};

const clearMessages = () => {
  document.querySelectorAll('.error-message').forEach((el) => {
    el.textContent = '';
  });
  if (formFeedback) {
    formFeedback.textContent = '';
    formFeedback.classList.remove('success');
  }
};

const validateForm = () => {
  let valid = true;
  clearMessages();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');

  if (!nameInput.value.trim()) {
    showMessage(nameInput, 'Please enter your name.');
    valid = false;
  }

  if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
    showMessage(emailInput, 'Please enter a valid email address.');
    valid = false;
  }

  if (!phoneInput.value.trim() || !isValidPhone(phoneInput.value.trim())) {
    showMessage(phoneInput, 'Phone number must contain only digits.');
    valid = false;
  }

  if (!messageInput.value.trim()) {
    showMessage(messageInput, 'Please enter a message.');
    valid = false;
  }

  return valid;
};

const handleSubmit = (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  if (formFeedback) {
    formFeedback.textContent = 'Message sent successfully. Thank you!';
    formFeedback.classList.add('success');
  }

  contactForm.reset();
};

const initContactForm = () => {
  contactForm?.addEventListener('submit', handleSubmit);
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      showMessage(input, '');
      if (formFeedback) {
        formFeedback.textContent = '';
        formFeedback.classList.remove('success');
      }
    });
  });
};

window.addEventListener('DOMContentLoaded', initContactForm);
