/**
 * Sinux Sanitization Utility
 * 
 * Provides basic defense-in-depth sanitization for user-provided strings 
 * before they are sent to the backend.
 */

/**
 * Strips HTML tags and removes potentially dangerous characters.
 * @param {string} input 
 * @returns {string}
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .trim();
};

/**
 * Sanitizes all string values within an object (shallow).
 * @param {Object} obj 
 * @returns {Object}
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = { ...obj };
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]);
    }
  });
  
  return sanitized;
};

/**
 * Validates GUID format.
 * @param {string} guid 
 * @returns {boolean}
 */
export const isValidGuid = (guid) => {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return pattern.test(guid);
};
