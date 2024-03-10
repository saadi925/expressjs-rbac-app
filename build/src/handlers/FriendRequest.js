"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSentFriendRequests = exports.getRecievedRequests = exports.rejectFriendRequest = exports.acceptFriendRequest = exports.sendFriendRequest = exports.getFriends = exports.removeFriend = void 0;
const express_1 = __importDefault(require("express"));
const FriendRequest_1 = require("../../prisma/queries/FriendRequest");
const FriendShips_1 = require("../../prisma/queries/FriendShips");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const friendship = new FriendShips_1.PrismaFriendship();
const friendRequest = new FriendRequest_1.PrismaFriendRequest();
// app.delete('/friendship/remove',
function removeFriend(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req;
            const { friendId } = req.body;
            yield friendship.removeFriend(userId, friendId);
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
    });
}
exports.removeFriend = removeFriend;
function getFriends(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.userId || typeof req.userId !== 'string') {
                res.status(401).json({ error: 'UnAuthorized' });
                return;
            }
            const friends = yield friendship.getFriends(req.userId);
            res.status(200).json(friends);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    });
}
exports.getFriends = getFriends;
// FriendRequest routes
function sendFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const { receiverId } = req.params;
            const request = yield friendRequest.sendFriendRequest(userId, receiverId);
            yield friendRequest.addToSent(userId, request.id);
            yield friendRequest.addToReceived(receiverId, request.id);
            res.status(200).json({ message: 'friend request sent' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    });
}
exports.sendFriendRequest = sendFriendRequest;
function acceptFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { requestId } = req.params;
            const receiverId = req.userId;
            const request = yield friendRequest.acceptFriendRequest(BigInt(requestId), receiverId);
            yield friendship.addFriend(receiverId, request.userId);
            res.status(200).json({ message: 'you have accepted the friend request' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    });
}
exports.acceptFriendRequest = acceptFriendRequest;
function rejectFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { requestId } = req.params;
            const receiverId = req.userId;
            yield friendRequest.rejectFriendRequest(BigInt(requestId), receiverId);
            res.status(200).json({ message: 'you have rejected the friend request' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    });
}
exports.rejectFriendRequest = rejectFriendRequest;
function getRecievedRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const requests = yield friendRequest.getFriendRequests(userId);
            if (requests.length == 0) {
                res.status(404).json({
                    error: 'No Recieved Requests Found',
                });
            }
            const serialized = requests.map((friendRequest) => (Object.assign(Object.assign({}, friendRequest), { id: BigInt(friendRequest.id) })));
            res.status(200).json(serialized);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    });
}
exports.getRecievedRequests = getRecievedRequests;
function getSentFriendRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const requests = yield friendRequest.getSentFriendRequests(userId);
            if (requests.length == 0) {
                res.status(404).json({
                    error: 'No Sent FriendRequests Found',
                });
            }
            const serialized = requests.map((friendRequest) => (Object.assign(Object.assign({}, friendRequest), { id: BigInt(friendRequest.id) })));
            res.status(200).json(serialized);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    });
}
exports.getSentFriendRequests = getSentFriendRequests;
