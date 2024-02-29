import { FriendRequest, PrismaClient } from '@prisma/client';

export type FriendRequestData = Omit<FriendRequest, 'id'>;

export class PrismaFriendRequest {
  #prisma;

  constructor() {
    this.#prisma = new PrismaClient();
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
