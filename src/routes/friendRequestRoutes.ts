import express from 'express';
import {
  acceptFriendRequest,
  getFriends,
  getRecievedRequests,
  getSentFriendRequests,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from '../../src/handlers/FriendRequest';

const router = express.Router();

router.post('/:caseId', sendFriendRequest);
router.put('/:requestId/accept', acceptFriendRequest);
router.put('/:requestId/reject', rejectFriendRequest);
router.get('/received', getRecievedRequests);
router.get('/sent', getSentFriendRequests);
router.delete('/friends/:requestId', removeFriend);
router.get('/friends', getFriends);

export { router as friendRequestRoutes };
