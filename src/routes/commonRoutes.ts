import express from 'express';
import {
  // getAllFriendshipsByUserId,
  getCaseStatuses,
} from '../../src/handlers/api';
import { authMiddleware } from '../../src/middleware/authMiddleware';
import {
  cancelCaseRequestHandler,
  getPendingCaseRequestsHandler,
  rejectCaseRequestHandler,
} from '../../src/handlers/clientCaseRequest';
import { upload } from '../../src/utils/attachments';
import {
  downloadingCaseAttachments,
  uploadingCaseAttachments,
} from '../../src/handlers/attachmentsHandler';

const router = express.Router();

// POST endpoint for uploading case attachments
router.post(
  '/case/:caseId/attachments',
  authMiddleware,
  upload.single('file'),
  uploadingCaseAttachments,
);

// GET endpoint for downloading case attachments
router.get(
  '/case/:caseId/attachments/:filename',
  authMiddleware,
  downloadingCaseAttachments,
);

//  get the statuses available for case
router.get('/case_statuses', authMiddleware, getCaseStatuses);

router.get(
  '/case_request/pending',
  authMiddleware,
  getPendingCaseRequestsHandler,
);

router.put(
  '/case_request/reject/:requestId',
  authMiddleware,
  rejectCaseRequestHandler,
);
router.put(
  '/case_request/cancel/:requestId',
  authMiddleware,
  cancelCaseRequestHandler,
);

export { router as commonRoutes };
