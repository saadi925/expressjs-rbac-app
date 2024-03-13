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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PrismaFriendRequest_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFriendRequest = void 0;
const client_1 = require("@prisma/client");
class PrismaFriendRequest {
    constructor() {
        _PrismaFriendRequest_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _PrismaFriendRequest_prisma, new client_1.PrismaClient(), "f");
    }
    sendFriendRequest(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const r = yield __classPrivateFieldGet(this, _PrismaFriendRequest_prisma, "f").friendRequest.create({
                    data: {
                        userId: senderId,
                        receiverId,
                    },
                });
                return r;
            }
            catch (error) {
                console.error('Error sending friend request:', error);
                throw new Error('Failed to send friend request');
            }
        });
    }
    acceptFriendRequest(requestId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friendRequest = yield __classPrivateFieldGet(this, _PrismaFriendRequest_prisma, "f").friendRequest.update({
                    where: { id: requestId, receiverId },
                    data: { status: 'ACCEPTED' },
                });
                return friendRequest;
            }
            catch (error) {
                console.error('Error accepting friend request:', error);
                throw new Error('Failed to accept friend request');
            }
        });
    }
    rejectFriendRequest(requestId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _PrismaFriendRequest_prisma, "f").friendRequest.update({
                    where: { id: requestId, receiverId },
                    data: { status: 'REJECTED' },
                });
            }
            catch (error) {
                console.error('Error rejecting friend request:', error);
                throw new Error('Failed to reject friend request');
            }
        });
    }
    getFriendRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friendRequests = yield __classPrivateFieldGet(this, _PrismaFriendRequest_prisma, "f").friendRequest.findMany({
                    where: { receiverId: userId },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        sender: {
                            select: {
                                profile: { select: { avatar: true, displayname: true } },
                            },
                        },
                    },
                });
                return friendRequests;
            }
            catch (error) {
                console.error('Error fetching friend requests:', error);
                throw new Error('Failed to fetch friend requests');
            }
        });
    }
    getSentFriendRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sentRequests = yield __classPrivateFieldGet(this, _PrismaFriendRequest_prisma, "f").friendRequest.findMany({
                    where: { userId },
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
                return sentRequests;
            }
            catch (error) {
                console.error('Error fetching sent friend requests:', error);
                throw new Error('Failed to fetch sent friend requests');
            }
        });
    }
    addToSent(senderId, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _PrismaFriendRequest_prisma, "f").user.update({
                    where: { id: senderId },
                    data: { sentFriendRequests: { connect: { id: requestId } } },
                });
            }
            catch (error) {
                console.error('Error adding to sent friend requests:', error);
                throw new Error('Failed to add to sent friend requests');
            }
        });
    }
    removeFromSent(senderId, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _PrismaFriendRequest_prisma, "f").user.update({
                    where: { id: senderId },
                    data: { sentFriendRequests: { disconnect: { id: requestId } } },
                });
            }
            catch (error) {
                console.error('Error removing from sent friend requests:', error);
                throw new Error('Failed to remove from sent friend requests');
            }
        });
    }
    addToReceived(receiverId, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _PrismaFriendRequest_prisma, "f").user.update({
                    where: { id: receiverId },
                    data: { receivedFriendRequests: { connect: { id: requestId } } },
                });
            }
            catch (error) {
                console.error('Error adding to received friend requests:', error);
                throw new Error('Failed to add to received friend requests');
            }
        });
    }
    removeFromReceived(receiverId, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _PrismaFriendRequest_prisma, "f").user.update({
                    where: { id: receiverId },
                    data: { receivedFriendRequests: { disconnect: { id: requestId } } },
                });
            }
            catch (error) {
                console.error('Error removing from received friend requests:', error);
                throw new Error('Failed to remove from received friend requests');
            }
        });
    }
}
exports.PrismaFriendRequest = PrismaFriendRequest;
_PrismaFriendRequest_prisma = new WeakMap();
