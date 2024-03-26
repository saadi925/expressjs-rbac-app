import { body } from 'express-validator';
export const createLawyerProfileValidationRules = () => [
  // Validate bio (optional)
  body('bio').optional().isString().withMessage('Bio must be a string'),

  body('experience').isString().withMessage('Experience must be a string'),

  body('education').isString().withMessage('Education must be a string'),

  // Validate specialization (optional)
  body('specialization')
    .isString()
    .isLength({ max: 60 })
    .withMessage('Specialization must be a valid'),

  body('description').isString().withMessage('Description must be a string'),
  body('email').isEmail().withMessage('Email must be a valid email'),
  body('phone')
    .optional()
    .matches(/^[0-9]{11}$/)
    .withMessage('Phone number must be a valid phone number'),
  body('linkedin')
    .optional()
    //  regex to validate linkedin url
    .matches(/^(https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]{5,30}\/?)$/)
    .withMessage('Linkedin must be a valid linkedin url'),
  body('website')
    .optional()
    //  regex to validate website url
    .matches(/^(https?:\/\/(www\.)?[a-zA-Z0-9-]{2,63}\.[a-z]{2,63}\/?)$/)
    .withMessage('Website must be a valid website url'),
  body('instagram')
    .optional()
    //  regex to validate instagram url
    .matches(/^(https:\/\/www\.instagram\.com\/[a-zA-Z0-9_-]{5,30}\/?)$/)
    .withMessage('Instagram must be a valid instagram url'),
  body('facebook')
    .optional()
    //  regex to validate facebook url
    .matches(/^(https:\/\/www\.facebook\.com\/[a-zA-Z0-9_-]{5,30}\/?)$/)
    .withMessage('Facebook must be a valid facebook url'),
  body('officeAddress')
    .optional()
    .isString()
    .isLength({ max: 100 })
    //  valid office address regex
    .matches(/^[a-zA-Z0-9\s,.'-]{5,100}$/)
    .withMessage('Office address must be a string'),
];
