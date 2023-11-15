import express from 'express';
import { check } from 'express-validator';
import { signinHandler, signupHandler } from './../handlers/authHandler';
import { validateLoginCredentials, validateUserCred } from '../controllers/validator';
import {authMiddleware} from '../middleware/authMiddleware';
import { RBACMiddleware } from '../handlers/rbacMiddleware';

const router = express.Router();
// create user route (sign up)
router.post('/signup',
validateUserCred,
 signupHandler);

// sign in route
router.post(
    '/signin',validateLoginCredentials,
    signinHandler
  );
router.get(
    '/lawyer',authMiddleware,RBACMiddleware,(req,res)=>{
        res.send("hello lawyer")
    }
  );
router.get(
    '/client',authMiddleware,RBACMiddleware,(req,res)=>{
        res.send("hello client")
    }
  );
export default router;

