import { body } from 'express-validator';
export const createLawyerProfileValidationRules = () => [
  // Validate bio (optional)
  body('bio').optional().isString().withMessage('Bio must be a string'),

  // Validate experience (optional)
  body('experience')
    .optional()
    .isString()
    .withMessage('Experience must be a string'),

  // Validate education (optional)
  body('education')
    .optional()
    .isString()
    .withMessage('Education must be a string'),

  // Validate phoneNumber (optional)
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Phone number must be a valid phone number'),

  // Validate facebook (optional)
  body('facebook')
    .optional()
    .isURL()
    .withMessage('Facebook must be a valid URL'),

  // Validate linkedin (optional)
  body('linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn must be a valid URL'),

  // Validate instagram (optional)
  body('instagram')
    .optional()
    .isURL()
    .withMessage('Instagram must be a valid URL'),

  // Validate specialization (optional)
  body('specialization')
    .optional()
    .isString()
    .withMessage('Specialization must be a string'),

  // Validate status (optional)
  body('status')
    .optional()
    .isIn(['AVAILABLE', 'BUSY', 'OFFLINE'])
    .withMessage('Status must be one of AVAILABLE, BUSY, or OFFLINE'),

  // Validate phone (optional)
  body('phone')
    .optional()
    .isMobilePhone('en-PK')
    .withMessage('Phone must be a valid phone number starting with +92 or 0'),

  // Validate email (optional)
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email must be a valid email address'),

  // Validate description (optional)
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];
