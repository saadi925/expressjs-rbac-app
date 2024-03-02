import express from 'express';
import {
  createCaseHandler,
  updateCaseHandler,
  deleteCaseHandler,
  getCasesHandler,
  getCaseByID,
  updateCaseStatus,
  getAllOpenCases,
} from '../handlers/caseHandler';
import { RBACMiddleware } from '../handlers/rbacMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// create a case
router.post('/case', authMiddleware, RBACMiddleware, createCaseHandler);
// update a case
router.put('/case/:id', authMiddleware, RBACMiddleware, updateCaseHandler);
// delete a case
router.delete('/case/:id', authMiddleware, RBACMiddleware, deleteCaseHandler);
// get a case by id
router.get('/case/:id', authMiddleware, RBACMiddleware, getCaseByID);
// get all cases
router.get('/cases', authMiddleware, RBACMiddleware, getCasesHandler);

router.get('/cases/open', authMiddleware, RBACMiddleware, getAllOpenCases);
router.put('/update-case-status/:id', authMiddleware, updateCaseStatus);
export { router as clientRoutes };
