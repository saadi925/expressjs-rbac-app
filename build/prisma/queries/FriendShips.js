"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFriendship = void 0;
const client_1 = require("@prisma/client");
class PrismaFriendship {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async addFriend(userId, friendId) {
        try {
            await this.#prisma.friendship.create({
                data: {
                    userId: userId,
                    friendId: friendId,
                },
            });
        }
        catch (error) {
            console.error('Error adding friend:', error);
            throw new Error('Failed to add friend');
        }
    }
    async removeFriend(userId, friendId) {
        try {
            await this.#prisma.friendship.deleteMany({
                where: {
                    OR: [
                        { userId: userId, friendId: friendId },
                        { userId: friendId, friendId: userId },
                    ],
                },
            });
        }
        catch (error) {
            console.error('Error removing friend:', error);
            throw new Error('Failed to remove friend');
        }
    }
    async getFriends(userId) {
        try {
            const friends = await this.#prisma.friendship.findMany({
                where: { userId },
            });
            return friends;
        }
        catch (error) {
            console.error('Error fetching friends:', error);
            throw new Error('Failed to fetch friends');
        }
    }
}
exports.PrismaFriendship = PrismaFriendship;
