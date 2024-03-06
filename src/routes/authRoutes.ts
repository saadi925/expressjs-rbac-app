import express from 'express';
import {
  emailVerificationHandler,
  resendConfirmation,
  signinHandler,
  signupHandler,
  verifyWithCode,
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
router.get('/email_verify', emailVerificationHandler);
router.put('/email_verify_code', verifyWithCode);
router.put('/email_verify/resend', resendConfirmation);

export { router as authRoutes };
