import { PrismaClient } from '@prisma/client';

export class PrismaFriendship {
  #prisma;
  constructor() {
    this.#prisma = new PrismaClient();
  }
  async addFriend(userId: string, friendId: string): Promise<void> {
    try {
      await this.#prisma.friendship.create({
        data: {
          userId: userId,
          friendId: friendId,
        },
      });
    } catch (error) {
      console.error('Error adding friend:', error);
      throw new Error('Failed to add friend');
    }
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    try {
      await this.#prisma.friendship.deleteMany({
        where: {
          OR: [
            { userId: userId, friendId: friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });
    } catch (error) {
      console.error('Error removing friend:', error);
      throw new Error('Failed to remove friend');
    }
  }

  async getFriends(userId: string) {
    try {
      const friends = await this.#prisma.friendship.findMany({
        where: { userId },
      });
      return friends;
    } catch (error) {
      console.error('Error fetching friends:', error);
      throw new Error('Failed to fetch friends');
    }
  }
}
