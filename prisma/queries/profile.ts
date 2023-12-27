import { Profile } from '@prisma/client';
import { prisma } from '.';
import { ProfileCredentials } from 'types/profile';
export const saveProfile = async (data: ProfileCredentials, userId: string) => {
  const pf = await prisma.profile.upsert({
    where: { userId: userId },
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
};

export const updateProfile = async (
  userId: string,
  data: ProfileCredentials,
) => {
  return await prisma.profile.update({
    where: { userId },
    data,
  });
};
export const setAvatar = async (userId: string, avatar: string) => {
  return await prisma.profile.update({
    where: { userId },
    data: { avatar },
  });
};
export const getProfile = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: { userId },
  });
};
export const setDisplayName = async (userId: string, displayname: string) => {
  return await prisma.profile.update({
    where: { userId },
    data: { displayname },
  });
};
export const setBio = async (userId: string, bio: string) => {
  return await prisma.profile.update({
    where: { userId },
    data: { bio },
  });
};
