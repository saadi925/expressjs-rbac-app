import { prisma } from '.';

import { Case } from '@prisma/client';
type CaseData = Omit<Case, 'id'>;
export const createCase = async (data: CaseData) => {
  const createdCase = await prisma.case.create({
    data,
  });
  return createdCase;
};

const updateCase = async (id: number, data: Case) => {
  return await prisma.case.update({
    where: { id },
    data,
  });
};
const deleteCase = async (id: number) => {
  return await prisma.case.delete({
    where: { id },
  });
};
const getCases = async () => {
  return await prisma.case.findMany();
};
const getCase = async (id: number) => {
  return await prisma.case.findUnique({
    where: { id },
  });
};
