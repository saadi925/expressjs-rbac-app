import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { RBACMiddleware } from '../middleware/rbacMiddleware';
import {
  acceptCaseRequestLawyerHandler,
  createCaseRequestLawyerHandler,
} from '../../src/handlers/LawyerCaseRequests';

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

export { r as lawyerRoutes };
