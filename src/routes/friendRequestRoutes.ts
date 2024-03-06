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

router.post('/friend-requests/:receiverId', sendFriendRequest);
router.put('/friend-requests/:requestId/accept', acceptFriendRequest);
router.put('/friend-requests/:requestId/reject', rejectFriendRequest);
router.get('/friend-requests/received', getRecievedRequests);
router.get('/friend-requests/sent', getSentFriendRequests);
router.delete('/friends/:friendId', removeFriend);
router.get('/friends', getFriends);

export { router as friendRequestRoutes };
