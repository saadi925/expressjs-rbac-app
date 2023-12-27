import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
export * from './auth';
export * from './profile';
export * from './cases';
