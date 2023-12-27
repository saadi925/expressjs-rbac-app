import express from 'express';
import { createCaseHandler } from '../handlers/caseHandler';
import { RBACMiddleware } from '../handlers/rbacMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/case', authMiddleware, RBACMiddleware, createCaseHandler);

export { router as clientRoutes };
