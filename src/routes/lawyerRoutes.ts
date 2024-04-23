import express from 'express';
import {
  RBACMiddleware,
  authMiddleware,
  validateContact,
  createLawyerProfileValidationRules,
} from '../middleware';
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
import {  getCasesHandlerForLawyer } from '../../src/handlers/caseHandler';
import { GetClients } from '../../src/handlers/lawyers';
// lawyerRoutes
//  '/lawyer '
const r = express.Router();
// GET ALL PENDING CASE REQUESTS
//  LAWYER --> body 'case_id', 'client_id'
r.post(
  '/case_request',
  authMiddleware,
  RBACMiddleware,
  createCaseRequestLawyerHandler,
);
r.get(
  '/case_request/pending',
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
r.post(
  '/profile',
  authMiddleware,
  RBACMiddleware,
  createLawyerProfileValidationRules,
  createOrUpdateLawyerProfile,
);
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
r.get('/cases', authMiddleware, RBACMiddleware, getCasesHandlerForLawyer);
r.get('/clients', authMiddleware, RBACMiddleware, GetClients);
export { r as lawyerRoutes };
