import {
  PrismaClient,
  Friendship as PrismaFriendshipModel,
} from '@prisma/client';

export type FriendshipData = Omit<PrismaFriendshipModel, 'id'>;

export class PrismaFriendship {
  #prisma: PrismaClient;

  constructor() {
    this.#prisma = new PrismaClient();
  }

  async createFriendship(
    user1Id: string,
    user2Id: string,
  ): Promise<PrismaFriendshipModel> {
    const friendship = await this.#prisma.friendship.create({
      data: {
        user1Id,
        user2Id,
      },
    });
    return friendship;
  }

  async getFriendshipsForUser(
    userId: string,
  ): Promise<PrismaFriendshipModel[]> {
    const friendships = await this.#prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });
    return friendships;
  }
}
