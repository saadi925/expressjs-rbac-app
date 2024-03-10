import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { RBACMiddleware } from '../middleware/rbacMiddleware';
import {
  acceptCaseRequestLawyerHandler,
  createCaseRequestLawyerHandler,
} from '../../src/handlers/LawyerCaseRequests';
import {
  createOrUpdateLawyerProfile,
  getLawyerProfile,
} from '../../src/handlers/LawyerProfileHandler';
import {
  createLawyerContact,
  updateLawyerContact,
} from '../../src/handlers/LawyerContact';
import { validateContact } from '../../src/middleware/validator';

const r = express.Router();
// GET ALL PENDING CASE REQUESTS
//  LAWYER --> body 'case_id', 'client_id'
r.post(
  '/case_request',
  authMiddleware,
  RBACMiddleware,
  createCaseRequestLawyerHandler,
);
r.put(
  '/case_request/accept/:requestId',
  authMiddleware,
  RBACMiddleware,
  acceptCaseRequestLawyerHandler,
);
r.post('/profile', authMiddleware, RBACMiddleware, createOrUpdateLawyerProfile);
r.get('/profile', authMiddleware, RBACMiddleware, getLawyerProfile);

r.post(
  '/profile/contact',
  authMiddleware,
  RBACMiddleware,
  validateContact,
  createLawyerContact,
);
r.put(
  '/profile/contact',
  authMiddleware,
  RBACMiddleware,
  validateContact,
  updateLawyerContact,
);

export { r as lawyerRoutes };
