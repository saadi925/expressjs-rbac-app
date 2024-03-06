import { FriendRequest, PrismaClient } from '@prisma/client';

export class PrismaFriendRequest {
  #prisma;
  constructor() {
    this.#prisma = new PrismaClient();
  }
  async sendFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequest> {
    try {
      const r = await this.#prisma.friendRequest.create({
        data: {
          userId: senderId,
          receiverId,
        },
      });
      return r;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw new Error('Failed to send friend request');
    }
  }

  async acceptFriendRequest(
    requestId: bigint,
    receiverId: string,
  ): Promise<FriendRequest> {
    try {
      const friendRequest = await this.#prisma.friendRequest.update({
        where: { id: requestId, receiverId },
        data: { status: 'ACCEPTED' },
      });
      return friendRequest;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw new Error('Failed to accept friend request');
    }
  }

  async rejectFriendRequest(
    requestId: bigint,
    receiverId: string,
  ): Promise<void> {
    try {
      await this.#prisma.friendRequest.update({
        where: { id: requestId, receiverId },
        data: { status: 'REJECTED' },
      });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      throw new Error('Failed to reject friend request');
    }
  }

  async getFriendRequests(userId: string) {
    try {
      const friendRequests = await this.#prisma.friendRequest.findMany({
        where: { receiverId: userId },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return friendRequests;
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      throw new Error('Failed to fetch friend requests');
    }
  }

  async getSentFriendRequests(userId: string) {
    try {
      const sentRequests = await this.#prisma.friendRequest.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return sentRequests;
    } catch (error) {
      console.error('Error fetching sent friend requests:', error);
      throw new Error('Failed to fetch sent friend requests');
    }
  }
  async addToSent(senderId: string, requestId: bigint): Promise<void> {
    try {
      await this.#prisma.user.update({
        where: { id: senderId },
        data: { sentFriendRequests: { connect: { id: requestId } } },
      });
    } catch (error) {
      console.error('Error adding to sent friend requests:', error);
      throw new Error('Failed to add to sent friend requests');
    }
  }

  async removeFromSent(senderId: string, requestId: bigint): Promise<void> {
    try {
      await this.#prisma.user.update({
        where: { id: senderId },
        data: { sentFriendRequests: { disconnect: { id: requestId } } },
      });
    } catch (error) {
      console.error('Error removing from sent friend requests:', error);
      throw new Error('Failed to remove from sent friend requests');
    }
  }

  async addToReceived(receiverId: string, requestId: bigint): Promise<void> {
    try {
      await this.#prisma.user.update({
        where: { id: receiverId },
        data: { receivedFriendRequests: { connect: { id: requestId } } },
      });
    } catch (error) {
      console.error('Error adding to received friend requests:', error);
      throw new Error('Failed to add to received friend requests');
    }
  }

  async removeFromReceived(
    receiverId: string,
    requestId: bigint,
  ): Promise<void> {
    try {
      await this.#prisma.user.update({
        where: { id: receiverId },
        data: { receivedFriendRequests: { disconnect: { id: requestId } } },
      });
    } catch (error) {
      console.error('Error removing from received friend requests:', error);
      throw new Error('Failed to remove from received friend requests');
    }
  }
}
