/* ==========================================================================
   Forms — Validation, submission handling
   ========================================================================== */

'use strict';

const Forms = (() => {
  'use strict';

  // --- Validation rules ---
  const rules = {
    required: (value) => value.trim().length > 0,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^[\d\s+\-()]{7,20}$/.test(value),
    minLength: (value, min) => value.trim().length >= min,
    maxLength: (value, max) => value.trim().length <= max,
  };

  // --- Validate a single field ---
  const validateField = (field) => {
    const value = field.value;
    const validations = field.dataset.validate ? field.dataset.validate.split(' ') : [];
    const errors = [];

    validations.forEach((validation) => {
      if (validation === 'required' && !rules.required(value)) {
        errors.push(field.dataset.errorRequired || 'This field is required');
      }
      if (validation === 'email' && !rules.email(value)) {
        errors.push(field.dataset.errorEmail || 'Please enter a valid email address');
      }
      if (validation === 'phone' && !rules.phone(value)) {
        errors.push(field.dataset.errorPhone || 'Please enter a valid phone number');
      }
      if (validation.startsWith('min:')) {
        const min = parseInt(validation.split(':')[1]);
        if (!rules.minLength(value, min)) {
          errors.push(field.dataset.errorMin || `Minimum ${min} characters required`);
        }
      }
      if (validation.startsWith('max:')) {
        const max = parseInt(validation.split(':')[1]);
        if (!rules.maxLength(value, max)) {
          errors.push(field.dataset.errorMax || `Maximum ${max} characters allowed`);
        }
      }
    });

    // Show/hide error
    const errorEl = field.closest('.form__group')?.querySelector('.form__error');
    if (errors.length) {
      field.classList.add('form__input--error');
      if (errorEl) {
        errorEl.textContent = errors[0];
        errorEl.style.display = 'block';
      }
      return false;
    } else {
      field.classList.remove('form__input--error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
      return true;
    }
  };

  // --- Validate entire form ---
  const validateForm = (form) => {
    const fields = form.querySelectorAll('[data-validate]');
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  };

  // --- Handle form submission ---
  const handleSubmit = async (form) => {
    const submitBtn = form.querySelector('[type="submit"]');
    const messageEl = form.querySelector('[data-form-message]');

    // Validate
    if (!validateForm(form)) {
      // Focus first error field
      const firstError = form.querySelector('.form__input--error');
      if (firstError) firstError.focus();
      return;
    }

    // Disable button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = submitBtn.dataset.loadingText || 'Sending...';
    }

    try {
      const formData = new FormData(form);

      // Check if form has action attribute
      if (form.action && form.action !== '#') {
        const response = await fetch(form.action, {
          method: form.method || 'POST',
          body: formData,
          headers: form.method !== 'POST' ? {} : undefined,
        });

        if (!response.ok) throw new Error('Submission failed');
      }

      // Success
      showMessage(form, 'success', form.dataset.successMessage || 'Thank you! Your message has been sent successfully.');
      form.reset();
    } catch (err) {
      // Error
      showMessage(form, 'error', form.dataset.errorMessage || 'Something went wrong. Please try again later.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || submitBtn.textContent;
      }
    }
  };

  // --- Show form message ---
  const showMessage = (form, type, text) => {
    let messageEl = form.querySelector('[data-form-message]');

    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.setAttribute('data-form-message', '');
      form.appendChild(messageEl);
    }

    messageEl.className = `form__message form__message--${type}`;
    messageEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${type === 'success' 
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' 
          : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
        }
      </svg>
      <span>${text}</span>
    `;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  };

  // --- Public ---

  const init = () => {
    // Real-time validation on blur
    document.querySelectorAll('[data-validate]').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('form__input--error')) {
          validateField(field);
        }
      });
    });

    // Form submission
    document.querySelectorAll('[data-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit(form);
      });
    });
  };

  return { init, validateField, validateForm };
})();
