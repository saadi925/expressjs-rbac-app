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
import { getMessages } from '../../src/handlers/messagesHandler';

const router = express.Router();
//  get the statuses available for case

router.get('/case_statuses', authMiddleware, getCaseStatuses);
// CaseRequests Routes
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

router.get('/messages', authMiddleware, getMessages);
export { router as commonRoutes };
