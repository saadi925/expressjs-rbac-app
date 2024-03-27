"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLawyerProfileValidationRules = void 0;
const express_validator_1 = require("express-validator");
exports.createLawyerProfileValidationRules = [
    (0, express_validator_1.body)('experience').isString().withMessage('Experience must be a string'),
    (0, express_validator_1.body)('education').isString().withMessage('Education must be a string'),
    // Validate specialization (optional)
    (0, express_validator_1.body)('specialization')
        .isString()
        .isLength({ max: 60 })
        .withMessage('Specialization must be a valid'),
    (0, express_validator_1.body)('description').isString().withMessage('Description must be a string'),
    (0, express_validator_1.check)('email')
        .optional()
        .isEmail()
        .withMessage('Email must be a valid email'),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^\+92\d{10}$/)
        .withMessage('Phone number must be a valid Pakistani phone number starting with +92'),
    (0, express_validator_1.body)('linkedin')
        .optional()
        //  regex to validate linkedin url
        .matches(/^(https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]{5,30}\/?)$/)
        .withMessage('Linkedin must be a valid linkedin url'),
    (0, express_validator_1.body)('website')
        .optional()
        //  regex to validate website url
        .matches(/^(https?:\/\/(www\.)?[a-zA-Z0-9-]{2,63}\.[a-z]{2,63}\/?)$/)
        .withMessage('Website must be a valid website url'),
    (0, express_validator_1.body)('instagram')
        .optional()
        //  regex to validate instagram url
        .matches(/^(https:\/\/www\.instagram\.com\/[a-zA-Z0-9_-]{5,30}\/?)$/)
        .withMessage('Instagram must be a valid instagram url'),
    (0, express_validator_1.body)('facebook')
        .optional()
        //  regex to validate facebook url
        .matches(/^(https:\/\/www\.facebook\.com\/[a-zA-Z0-9_-]{5,30}\/?)$/)
        .withMessage('Facebook must be a valid facebook url'),
    (0, express_validator_1.body)('officeAddress')
        .optional()
        .isString()
        .isLength({ max: 100 })
        //  valid office address regex
        .matches(/^[a-zA-Z0-9\s,.'-]{5,100}$/)
        .withMessage('Office address must be a string'),
];
