import { PrismaClient } from '@prisma/client';
import { prisma } from '.';
import { ProfileCredentials } from 'types/profile';
export class PrismaProfile {
  #prisma;
  constructor() {
    this.#prisma = new PrismaClient();
  }
  async createProfile(data: ProfileCredentials, userId: string) {
    const pf = await this.#prisma.profile.upsert({
      where: { userId },
      update: { ...data },
      create: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return pf;
  }
  async updateProfile(userId: string, data: ProfileCredentials) {
    return await this.#prisma.profile.update({
      where: { userId },
      data,
    });
  }
  async getProfile(userId: string) {
    return await this.#prisma.profile.findUnique({
      where: { userId },
    });
  }
  async setDisplayName(userId: string, displayname: string) {
    return await this.#prisma.profile.update({
      where: { userId },
      data: { displayname },
    });
  }
  async setBio(userId: string, bio: string) {
    return await this.#prisma.profile.update({
      where: { userId },
      data: { bio },
    });
  }
  async setAvatar(userId: string, avatar: string) {
    return await this.#prisma.profile.update({
      where: { userId },
      data: { avatar },
    });
  }
  async deleteProfile(userId: string) {
    return await this.#prisma.profile.delete({
      where: {
        id: userId,
      },
    });
  }
}
