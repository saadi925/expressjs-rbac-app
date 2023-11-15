import {check} from 'express-validator'
export const validateUserCred = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters and special characters'
    ).matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/), 
    check('role').isIn(['lawyer', 'client']).withMessage('role is required , it could be lawyer or client'),

  ]
export const validateLoginCredentials = [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters and special characters'
    ).matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/), 
  ]