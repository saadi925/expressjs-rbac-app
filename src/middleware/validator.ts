import { check } from 'express-validator';
export const validateUserCred = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 8 or more characters and special characters',
  ).matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
  check('role')
    .isIn(['LAWYER', 'CLIENT'])
    .withMessage('role is required , it could be lawyer or client'),
];
export const validateLoginCredentials = [
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 8 or more characters and special characters, \n e.g Plasma51a&',
  ).matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
];
// Validator middleware for checking URLs
export const isValidUrl = (url: string) => {
  // Regex to validate URL format
  const urlRegex = /^(https?:\/\/)?([\w\d]+\.)+[\w\d]{2,}(\/.*)*$/;
  return urlRegex.test(url);
};
export function isValidFacebookProfile(url: string) {
  const regex = /^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i;
  return regex.test(url);
}

// Validator middleware for checking phone numbers
export const isValidPhoneNumber = (phone: string) => {
  // Regex to validate phone number format
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};
export function isValidInstagramProfile(url: string) {
  const regex = /^(https?:\/\/)?((w{3}\.)?)instagram.com\/.*/i;
  return regex.test(url);
}

export function isValidLinkedInProfile(url: string) {
  const regex = /^(https?:\/\/)?((w{3}\.)?)linkedin.com\/(in|pub|company)\/.*/i;
  return regex.test(url);
}

// Validator middleware for checking email addresses
export const isValidEmail = (email: string) => {
  // Regex to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const validateContact = [
  check('email').custom(isValidEmail).withMessage('Invalid email address'),
  check('phone').custom(isValidPhoneNumber).withMessage('Invalid phone number'),
  check('facebook')
    .custom(isValidFacebookProfile)
    .withMessage('Invalid facebook profile'),
  check('instagram')
    .custom(isValidInstagramProfile)
    .withMessage('Invalid instagram profile'),
  check('linkedin')
    .custom(isValidLinkedInProfile)
    .withMessage('Invalid linkedin profile'),
  check('officeAddress').isString().withMessage('Invalid office address'),
];
