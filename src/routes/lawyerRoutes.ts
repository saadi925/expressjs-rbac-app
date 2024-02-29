import express from 'express';
import { assignCaseToLawyer } from '../handlers/caseAssign';
import { authMiddleware } from '../middleware/authMiddleware';
import { RBACMiddleware } from '../handlers/rbacMiddleware';

const r = express.Router();
r.post('/assign_case/:id', authMiddleware, RBACMiddleware, assignCaseToLawyer);
r.post('/', authMiddleware, RBACMiddleware);
r.put('/', authMiddleware, RBACMiddleware);

export { r as lawyerRoutes };
