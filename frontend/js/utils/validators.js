export const validators = {
  isRequired: (value) => {
    return value !== null && value !== undefined && value.trim() !== '';
  },
  
  isEmail: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  isMinLength: (value, min) => {
    return value && value.length >= min;
  },
  
  isPhone: (value) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
    return phoneRegex.test(value);
  }
};

/**
 * Validates a form input element and applies UI feedback
 * @param {HTMLInputElement} input 
 * @param {Array<Function>} rules 
 * @returns {Boolean} is valid
 */
export const validateInput = (input, rules) => {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return true;
  
  const errorElement = formGroup.querySelector('.form-error');
  
  for (const rule of rules) {
    const isValid = rule.validate(input.value);
    if (!isValid) {
      input.classList.add('form-input--error');
      if (errorElement) {
        errorElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${rule.message}`;
        errorElement.style.display = 'flex';
      }
      return false;
    }
  }
  
  // Clear error
  input.classList.remove('form-input--error');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
  return true;
};
