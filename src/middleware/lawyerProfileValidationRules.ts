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

  // Validate specialization (optional)
  body('specialization')
    .optional()
    .isString()
    .withMessage('Specialization must be a string'),

  // Validate description (optional)
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];
