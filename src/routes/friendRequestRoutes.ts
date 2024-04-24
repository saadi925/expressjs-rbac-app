import express from 'express';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriends,
  getRecievedRequests,
  getSentFriendRequests,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
  sendFriendRequestToLawyer,
} from '../../src/handlers/FriendRequest';

const router = express.Router();

router.post('/:caseId', sendFriendRequest);
router.post('/lawyer/:profileId', sendFriendRequestToLawyer);

router.put('/:requestId/accept', acceptFriendRequest);

router.put('/:requestId/reject', rejectFriendRequest);

router.put('/:requestId/cancel', cancelFriendRequest);

router.get('/received', getRecievedRequests);

router.get('/sent', getSentFriendRequests);

router.delete('/friends/:requestId', removeFriend);

router.get('/friends', getFriends);

export { router as friendRequestRoutes };
