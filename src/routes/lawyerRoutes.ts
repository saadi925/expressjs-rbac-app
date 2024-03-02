import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { RBACMiddleware } from '../handlers/rbacMiddleware';
import {
  cancelCaseRequestHandler,
  createCaseRequestHandler,
  getPendingCaseRequestsHandler,
  rejectCaseRequestHandler,
} from '../../src/handlers/caseRequests';

const r = express.Router();
//  LAWYER --> body 'case_id', 'client_id'

r.post(
  '/case_request',
  authMiddleware,
  RBACMiddleware,
  createCaseRequestHandler,
);
r.put(
  '/case_request/reject/:requestId',
  authMiddleware,
  RBACMiddleware,
  rejectCaseRequestHandler,
);
r.put(
  '/case_request/accept/:requestId',
  authMiddleware,
  RBACMiddleware,
  createCaseRequestHandler,
);
r.get(
  '/case_request/pending',
  authMiddleware,
  RBACMiddleware,
  getPendingCaseRequestsHandler,
);
r.put(
  '/case_request/pending',
  authMiddleware,
  RBACMiddleware,
  cancelCaseRequestHandler,
);

export { r as lawyerRoutes };
