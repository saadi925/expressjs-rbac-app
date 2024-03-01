import { FriendRequest, PrismaClient } from '@prisma/client';

export type FriendRequestData = Omit<FriendRequest, 'id'>;

export class PrismaFriendRequest {
  #prisma;

  constructor() {
    this.#prisma = new PrismaClient();
  }
  async getSenderId(requestId: bigint): Promise<string> {
    const request = await this.#prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) {
      throw new Error('Friend request not found');
    }
    return request.senderId;
  }
  async getReceiverId(requestId: bigint): Promise<string> {
    const request = await this.#prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) {
      throw new Error('Friend request not found');
    }
    return request.receiverId;
  }
  async sendFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequest> {
    const friendRequest = await this.#prisma.friendRequest.create({
      data: { senderId, receiverId },
    });
    return friendRequest;
  }

  async acceptFriendRequest(requestId: bigint): Promise<void> {
    await this.#prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });
  }

  async rejectFriendRequest(requestId: bigint): Promise<void> {
    await this.#prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  }

  async cancelFriendRequest(requestId: bigint): Promise<void> {
    await this.#prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    });
  }
  async getPendingFriendRequests(userId: string): Promise<FriendRequest[]> {
    const pendingRequests = await this.#prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
    });
    return pendingRequests;
  }
  async userExists(userId: string): Promise<boolean> {
    const user = await this.#prisma.user.findUnique({ where: { id: userId } });
    return !!user;
  }
}
