"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLawyerProfileValidationRules = void 0;
const express_validator_1 = require("express-validator");
const createLawyerProfileValidationRules = () => [
    // Validate bio (optional)
    (0, express_validator_1.body)('bio').optional().isString().withMessage('Bio must be a string'),
    // Validate experience (optional)
    (0, express_validator_1.body)('experience')
        .optional()
        .isString()
        .withMessage('Experience must be a string'),
    // Validate education (optional)
    (0, express_validator_1.body)('education')
        .optional()
        .isString()
        .withMessage('Education must be a string'),
    // Validate specialization (optional)
    (0, express_validator_1.body)('specialization')
        .optional()
        .isString()
        .withMessage('Specialization must be a string'),
    // Validate description (optional)
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
];
exports.createLawyerProfileValidationRules = createLawyerProfileValidationRules;
