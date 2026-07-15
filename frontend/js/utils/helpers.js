/**
 * Formats integer cents into a localized currency string.
 * Example: 15000 -> "$150.00"
 */
export const formatCurrency = (cents, locale = 'fr-DZ', currency = 'DZD') => {
  if (cents === null || cents === undefined) return '';
  
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  });
  
  return formatter.format(cents / 100);
};

/**
 * Generates a UUID v4
 */
export const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Promisified setTimeout for fake loading states
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Debounce function for inputs
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Parse URL query parameters
 */
export const parseQueryString = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};
