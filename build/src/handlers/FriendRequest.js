"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelFriendRequest = exports.getSentFriendRequests = exports.getRecievedRequests = exports.rejectFriendRequest = exports.acceptFriendRequest = exports.sendFriendRequest = exports.getFriends = exports.removeFriend = void 0;
const express_1 = __importDefault(require("express"));
const FriendRequest_1 = require("../../prisma/queries/FriendRequest");
const FriendShips_1 = require("../../prisma/queries/FriendShips");
const index_1 = require("../../prisma/queries/index");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const friendship = new FriendShips_1.PrismaFriendship();
const friendRequest = new FriendRequest_1.PrismaFriendRequest();
// app.delete('/friendship/remove',
async function removeFriend(req, res) {
    try {
        const { userId } = req;
        const { requestId } = req.body;
        //  get friend by request id
        const friendId = await friendRequest.getFriendByRequestId(requestId, userId);
        await friendship.removeFriend(userId, friendId);
        res.status(200).json({
            message: `friend removed successfully `,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
exports.removeFriend = removeFriend;
async function getFriends(req, res) {
    try {
        if (!req.userId || typeof req.userId !== 'string') {
            res.status(401).json({ error: 'UnAuthorized' });
            return;
        }
        const friends = await friendRequest.getAcceptedFriends(req.userId);
        res.status(200).json(friends);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
exports.getFriends = getFriends;
// FriendRequest routes
async function sendFriendRequest(req, res) {
    try {
        const userId = req.userId;
        const { caseId } = req.params;
        const clientCase = await index_1.prisma.case.findUnique({
            where: { id: BigInt(caseId) },
        });
        if (!clientCase) {
            res.status(404).json({
                error: 'Case not found',
            });
            return;
        }
        const receiverId = clientCase.clientId;
        const request = await friendRequest.sendFriendRequest(userId, receiverId);
        await friendRequest.addToSent(userId, request.id);
        await friendRequest.addToReceived(receiverId, request.id);
        res.status(200).json({ message: 'friend request sent' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
exports.sendFriendRequest = sendFriendRequest;
async function acceptFriendRequest(req, res) {
    try {
        const { requestId } = req.params;
        const receiverId = req.userId;
        const request = await friendRequest.acceptFriendRequest(BigInt(requestId), receiverId);
        await friendship.addFriend(receiverId, request.userId);
        res.status(200).json({ message: 'you have accepted the friend request' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
exports.acceptFriendRequest = acceptFriendRequest;
async function rejectFriendRequest(req, res) {
    try {
        const { requestId } = req.params;
        const receiverId = req.userId;
        await friendRequest.rejectFriendRequest(BigInt(requestId), receiverId);
        res.status(200).json({ message: 'you have rejected the friend request' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
exports.rejectFriendRequest = rejectFriendRequest;
async function getRecievedRequests(req, res) {
    try {
        const userId = req.userId;
        const requests = await friendRequest.getFriendRequests(userId);
        if (requests.length == 0) {
            res.status(404).json({
                error: 'No Recieved Requests Found',
            });
            return;
        }
        const serialized = requests.map((friendRequest) => ({
            ...friendRequest,
            id: String(friendRequest.id),
        }));
        res.status(200).json(serialized);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
exports.getRecievedRequests = getRecievedRequests;
async function getSentFriendRequests(req, res) {
    try {
        const userId = req.userId;
        const requests = await friendRequest.getSentFriendRequests(userId);
        if (requests.length == 0) {
            res.status(404).json({
                error: 'No Sent FriendRequests Found',
            });
            return;
        }
        const serialized = requests.map((friendRequest) => ({
            ...friendRequest,
            id: String(friendRequest.id),
        }));
        res.status(200).json(serialized);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
exports.getSentFriendRequests = getSentFriendRequests;
async function cancelFriendRequest(req, res) {
    try {
        const userId = req.userId;
        const { requestId } = req.params;
        const cancel = friendRequest.cancelFriendRequest(userId, BigInt(requestId));
        res.status(200).json({ message: 'request cancelled successfully' });
    }
    catch (error) {
    }
}
exports.cancelFriendRequest = cancelFriendRequest;
