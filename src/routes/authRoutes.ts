import express from 'express';
import {
  emailVerificationHandler,
  resendConfirmation,
  signinHandler,
  signupHandler,
} from './../handlers/authHandler';
import {
  validateLoginCredentials,
  validateUserCred,
} from '../middleware/validator';

const router = express.Router();
// create user route (sign up)
router.post('/signup', validateUserCred, signupHandler);

// sign in route
router.post('/signin', validateLoginCredentials, signinHandler);
router.post('/email-verify', emailVerificationHandler);
router.post('/resend-email-verify', resendConfirmation);

export { router as authRoutes };
