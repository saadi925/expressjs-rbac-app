import { userCredentials } from 'types/auth';
import bcrypt from 'bcrypt';
import { prisma } from '.';
export const createUser = async (credentials: userCredentials) => {
  const { name, email, role, verified } = credentials;
  const salt = await bcrypt.genSalt(10);
  const secretPassword = await bcrypt.hash(credentials.password, salt);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: secretPassword,
      role,
      verified,
    },
  });
  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export const updateUser = async (email: string, data: any) => {
  const user = await prisma.user.update({
    where: {
      email,
    },
    data,
  });
  return user;
};

export const setVerified = async (email: string) => {
  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      verified: true,
    },
  });
  return user;
};
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      verified: true,
    },
  });
  return user;
};
