import express from 'express';
import { signinHandler, signupHandler } from './../handlers/authHandler';
import {
  validateLoginCredentials,
  validateUserCred,
} from '../middleware/validator';

const router = express.Router();
// create user route (sign up)
router.post('/signup', validateUserCred, signupHandler);

// sign in route
router.post('/signin', validateLoginCredentials, signinHandler);

export { router as authRoutes };
