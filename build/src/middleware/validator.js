"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContact = exports.isValidEmail = exports.isValidLinkedInProfile = exports.isValidInstagramProfile = exports.isValidPhoneNumber = exports.isValidFacebookProfile = exports.isValidUrl = exports.validateLoginCredentials = exports.validateUserCred = void 0;
const express_validator_1 = require("express-validator");
exports.validateUserCred = [
    (0, express_validator_1.check)('name', 'Name is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.check)('password', 'Please enter a password with 8 or more characters and special characters').matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    (0, express_validator_1.check)('role')
        .isIn(['LAWYER', 'CLIENT'])
        .withMessage('role is required , it could be lawyer or client'),
];
exports.validateLoginCredentials = [
    (0, express_validator_1.check)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.check)('password', 'Please enter a password with 8 or more characters and special characters, \n e.g Plasma51a&').matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
];
// Validator middleware for checking URLs
const isValidUrl = (url) => {
    // Regex to validate URL format
    const urlRegex = /^(https?:\/\/)?([\w\d]+\.)+[\w\d]{2,}(\/.*)*$/;
    return urlRegex.test(url);
};
exports.isValidUrl = isValidUrl;
function isValidFacebookProfile(url) {
    const regex = /^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i;
    return regex.test(url);
}
exports.isValidFacebookProfile = isValidFacebookProfile;
// Validator middleware for checking phone numbers
const isValidPhoneNumber = (phone) => {
    // Regex to validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
};
exports.isValidPhoneNumber = isValidPhoneNumber;
function isValidInstagramProfile(url) {
    const regex = /^(https?:\/\/)?((w{3}\.)?)instagram.com\/.*/i;
    return regex.test(url);
}
exports.isValidInstagramProfile = isValidInstagramProfile;
function isValidLinkedInProfile(url) {
    const regex = /^(https?:\/\/)?((w{3}\.)?)linkedin.com\/(in|pub|company)\/.*/i;
    return regex.test(url);
}
exports.isValidLinkedInProfile = isValidLinkedInProfile;
// Validator middleware for checking email addresses
const isValidEmail = (email) => {
    // Regex to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
exports.validateContact = [
    (0, express_validator_1.check)('email')
        .optional()
        .custom(exports.isValidEmail)
        .withMessage('Invalid email address'),
    (0, express_validator_1.check)('phone').custom(exports.isValidPhoneNumber).withMessage('Invalid phone number'),
    (0, express_validator_1.check)('facebook')
        .optional()
        .custom(isValidFacebookProfile)
        .withMessage('Invalid facebook profile'),
    (0, express_validator_1.check)('instagram')
        .optional()
        .custom(isValidInstagramProfile)
        .withMessage('Invalid instagram profile'),
    (0, express_validator_1.check)('linkedin')
        .optional()
        .custom(isValidLinkedInProfile)
        .withMessage('Invalid linkedin profile'),
    (0, express_validator_1.check)('officeAddress').isString().withMessage('Invalid office address'),
];
