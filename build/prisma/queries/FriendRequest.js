"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFriendRequest = void 0;
const client_1 = require("@prisma/client");
class PrismaFriendRequest {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async getFriendByRequestId(requestId, userId) {
        try {
            const friendRequest = await this.#prisma.friendRequest.findUnique({
                where: { id: requestId },
            });
            if (!friendRequest) {
                throw new Error('Friend request not found');
            }
            const friendId = friendRequest.userId === userId
                ? friendRequest.receiverId
                : friendRequest.userId;
            return friendId;
        }
        catch (error) {
            console.error('Error fetching friend by request id:', error);
            throw new Error('Failed to fetch friend by request id');
        }
    }
    async sendFriendRequest(senderId, receiverId) {
        try {
            const r = await this.#prisma.friendRequest.create({
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
    }
    async acceptFriendRequest(requestId, receiverId) {
        try {
            const friendRequest = await this.#prisma.friendRequest.update({
                where: { id: requestId, receiverId },
                data: { status: 'ACCEPTED' },
            });
            return friendRequest;
        }
        catch (error) {
            console.error('Error accepting friend request:', error);
            throw new Error('Failed to accept friend request');
        }
    }
    async rejectFriendRequest(requestId, receiverId) {
        try {
            await this.#prisma.friendRequest.update({
                where: { id: requestId, receiverId },
                data: { status: 'REJECTED' },
            });
        }
        catch (error) {
            console.error('Error rejecting friend request:', error);
            throw new Error('Failed to reject friend request');
        }
    }
    async getFriendRequests(userId) {
        try {
            const friendRequests = await this.#prisma.friendRequest.findMany({
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
    }
    async getSentFriendRequests(userId) {
        try {
            const sentRequests = await this.#prisma.friendRequest.findMany({
                where: { userId },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    receiver: {
                        select: {
                            profile: { select: { avatar: true, displayname: true } },
                        }
                    }
                }
            });
            return sentRequests;
        }
        catch (error) {
            console.error('Error fetching sent friend requests:', error);
            throw new Error('Failed to fetch sent friend requests');
        }
    }
    async addToSent(senderId, requestId) {
        try {
            await this.#prisma.user.update({
                where: { id: senderId },
                data: { sentFriendRequests: { connect: { id: requestId } } },
            });
        }
        catch (error) {
            console.error('Error adding to sent friend requests:', error);
            throw new Error('Failed to add to sent friend requests');
        }
    }
    async removeFromSent(senderId, requestId) {
        try {
            await this.#prisma.user.update({
                where: { id: senderId },
                data: { sentFriendRequests: { disconnect: { id: requestId } } },
            });
        }
        catch (error) {
            console.error('Error removing from sent friend requests:', error);
            throw new Error('Failed to remove from sent friend requests');
        }
    }
    async addToReceived(receiverId, requestId) {
        try {
            await this.#prisma.user.update({
                where: { id: receiverId },
                data: { receivedFriendRequests: { connect: { id: requestId } } },
            });
        }
        catch (error) {
            console.error('Error adding to received friend requests:', error);
            throw new Error('Failed to add to received friend requests');
        }
    }
    async removeFromReceived(receiverId, requestId) {
        try {
            await this.#prisma.user.update({
                where: { id: receiverId },
                data: { receivedFriendRequests: { disconnect: { id: requestId } } },
            });
        }
        catch (error) {
            console.error('Error removing from received friend requests:', error);
            throw new Error('Failed to remove from received friend requests');
        }
    }
    async getAcceptedFriends(userId) {
        try {
            const friendRequests = await this.#prisma.friendRequest.findMany({
                where: {
                    OR: [{ receiverId: userId }, { userId }],
                    status: 'ACCEPTED',
                },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            profile: { select: { avatar: true, displayname: true } },
                            online: true,
                        },
                    },
                    receiver: {
                        select: {
                            id: true,
                            online: true,
                            profile: { select: { avatar: true, displayname: true } },
                        },
                    },
                },
            });
            const formattedFriendRequests = friendRequests.map((request) => {
                const isCurrentUserSender = request.sender.id === userId;
                const otherUserId = isCurrentUserSender
                    ? request.receiver.id
                    : request.sender.id;
                const otherUserProfile = isCurrentUserSender
                    ? request.receiver.profile
                    : request.sender.profile;
                return {
                    id: String(request.id),
                    otherUserId,
                    ...otherUserProfile,
                    online: isCurrentUserSender
                        ? request.receiver.online
                        : request.sender.online,
                };
            });
            return formattedFriendRequests;
        }
        catch (error) {
            console.error('Error fetching accepted friends:', error);
            throw new Error('Failed to fetch accepted friends');
        }
    }
    async cancelFriendRequest(userId, requestId) {
        try {
            await this.#prisma.friendRequest.update({
                where: { id: requestId, userId },
                data: { status: 'CANCELLED' },
            });
        }
        catch (error) {
            console.error('Error cancelling friend request:', error);
            throw new Error('Failed to cancelling friend request');
        }
    }
}
exports.PrismaFriendRequest = PrismaFriendRequest;
