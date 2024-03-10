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
import { RBACMiddleware } from '../middleware/rbacMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  createCaseRequestClientHandler,
  acceptCaseRequestClientHandler,
} from '../../src/handlers/clientCaseRequest';
import { uploadingCaseAttachments } from '../../src/handlers/attachmentsHandler';
import { createReview, updateReview } from 'src/handlers/Reviews';
import { GetLawyers } from '../../src/handlers/lawyers';

const router = express.Router();
// get a case by id
router.get('/case/:id', authMiddleware, getCaseByID);

router.put('/update-case-status/:id', authMiddleware, updateCaseStatus);
// create a case
router.post('/case', authMiddleware, RBACMiddleware, createCaseHandler);
// update a case
router.put('/case/:id', authMiddleware, RBACMiddleware, updateCaseHandler);
// delete a case
router.delete('/case/:id', authMiddleware, RBACMiddleware, deleteCaseHandler);
// get all cases 'CLIENT' only
router.get('/cases', authMiddleware, RBACMiddleware, getCasesHandler);
router.get('/cases/open', authMiddleware, RBACMiddleware, getAllOpenCases);

// lawyer id , case id
router.post(
  '/case_request',
  authMiddleware,
  RBACMiddleware,
  createCaseRequestClientHandler,
);
router.put(
  '/case_request/accept/:requestId',
  authMiddleware,
  RBACMiddleware,
  acceptCaseRequestClientHandler,
);
router.post(
  '/attachments',
  authMiddleware,
  RBACMiddleware,
  uploadingCaseAttachments,
);
router.get(
  '/attachments/:attachmentId',
  authMiddleware,
  RBACMiddleware,
  uploadingCaseAttachments,
);
router.put(
  '/attachments/:attachmentId',
  authMiddleware,
  RBACMiddleware,
  uploadingCaseAttachments,
);
router.delete(
  '/attachments/:attachmentId',
  authMiddleware,
  RBACMiddleware,
  uploadingCaseAttachments,
);
router.get('/lawyers', authMiddleware, RBACMiddleware, GetLawyers);
router.post('/review', authMiddleware, RBACMiddleware, createReview);
router.put('/review', authMiddleware, RBACMiddleware, updateReview);

export { router as clientRoutes };
