// Form validation functionality

document.addEventListener('DOMContentLoaded', function() {
  // Get all forms that need validation
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Add validation to each form
    setupFormValidation(form);
  });
  
  // Setup form validation
  function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Add blur event listeners to all inputs
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateInput(input);
      });
      
      // Also validate on input for some fields
      if (input.type === 'email' || input.type === 'password') {
        input.addEventListener('input', function() {
          validateInput(input);
        });
      }
    });
    
    // Validate form on submit
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      // Validate all inputs
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      // Additional validation for password confirmation
      if (form.id === 'register-form') {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        
        if (password.value !== confirmPassword.value) {
          showError(confirmPassword, 'Passwords do not match');
          isValid = false;
        }
      }
      
      // Prevent form submission if validation fails
      if (!isValid) {
        e.preventDefault();
      }
    });
  }
  
  // Validate a single input field
  function validateInput(input) {
    // Skip validation for non-required fields that are empty
    if (!input.hasAttribute('required') && !input.value) {
      removeError(input);
      return true;
    }
    
    // Validate based on input type
    switch (input.type) {
      case 'email':
        if (!isValidEmail(input.value)) {
          showError(input, 'Please enter a valid email address');
          return false;
        }
        break;
      
      case 'password':
        if (input.id === 'password' && input.value.length < 8) {
          showError(input, 'Password must be at least 8 characters');
          return false;
        }
        break;
      
      case 'number':
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        const value = parseFloat(input.value);
        
        if (isNaN(value)) {
          showError(input, 'Please enter a valid number');
          return false;
        }
        
        if (!isNaN(min) && value < min) {
          showError(input, `Value must be at least ${min}`);
          return false;
        }
        
        if (!isNaN(max) && value > max) {
          showError(input, `Value must be at most ${max}`);
          return false;
        }
        break;
      
      default:
        if (input.required && !input.value.trim()) {
          showError(input, 'This field is required');
          return false;
        }
    }
    
    // If we made it here, validation passed
    removeError(input);
    return true;
  }
  
  // Validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Show error message
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    // Remove any existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
  }
  
  // Remove error message
  function removeError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
});