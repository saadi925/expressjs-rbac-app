"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const FriendRequest_1 = require("../../src/handlers/FriendRequest");
const router = express_1.default.Router();
exports.friendRequestRoutes = router;
router.post('/:receiverId', FriendRequest_1.sendFriendRequest);
router.put('/:requestId/accept', FriendRequest_1.acceptFriendRequest);
router.put('/:requestId/reject', FriendRequest_1.rejectFriendRequest);
router.get('/received', FriendRequest_1.getRecievedRequests);
router.get('/sent', FriendRequest_1.getSentFriendRequests);
router.delete('/friends/:friendId', FriendRequest_1.removeFriend);
router.get('/friends', FriendRequest_1.getFriends);
