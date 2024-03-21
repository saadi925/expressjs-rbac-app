import { $Enums, PrismaClient } from '@prisma/client';
import { ProfileCredentials } from 'types/profile';
type profileGet = {
  id: string;
  displayname: string | null;
  createdAt: Date;
  updatedAt: Date;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  user: {
    role: $Enums.Role;
  };
};

export class PrismaDBProfile {
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
  async getProfileWithRole(userId: string): Promise<profileGet | null> {
    return await this.#prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        displayname: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        bio: true,
        location: true,
        phone: true,
        user: {
          select: {
            role: true,
          },
        },
      },
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
