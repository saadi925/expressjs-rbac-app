import express from 'express';
import { authMiddleware } from '../../src/middleware/authMiddleware';
import {
  cancelFriendRequestHandler,
  rejectFriendRequestHandler,
  sendFriendRequestHandler,
} from '../../src/handlers/FriendRequests';
import {
  acceptCaseRequestHandler,
  getPendingCaseRequestsHandler,
} from '../../src/handlers/caseRequests';

const router = express.Router();
// getting all pending requests
router.get('/', authMiddleware, getPendingCaseRequestsHandler);
// sending a friend request with recieverId
router.post('/send/:recieverId', authMiddleware, sendFriendRequestHandler);
// accepting a friend request with 'requestId'
router.post('/accept/:requestId', authMiddleware, acceptCaseRequestHandler);
// rejecting a friend request with 'requestId'
router.post('/reject/:requestId', authMiddleware, rejectFriendRequestHandler);
// cancelling a friend request with 'requestId'
router.post('/cancel/:requestId', authMiddleware, cancelFriendRequestHandler);

export { router as friendRequestsRoutes };
