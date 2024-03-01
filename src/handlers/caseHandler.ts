import { Response } from 'express';
import { CaseData, PrismaCase } from '../../prisma';
import { RequestWithCase } from 'types/case';
import { Case } from '@prisma/client';
import { validateCaseData } from '../../src/middleware/validateCaseData';
import { checkForUser } from './rbacMiddleware';
import { RequestWithUser } from 'types/profile';
const prismaCase = new PrismaCase();
//  this is the case creation handler , only 'CLIENT' can create the case,
export const createCaseHandler = async (
  req: RequestWithCase,
  res: Response,
) => {
  const { title, description, status } = req.body;

  const ok = checkForUser(req, res);
  if (!ok) {
    return;
  }
  const error = validateCaseData(req.body);
  if (error) {
    return res.status(403).json({ error: error.message });
  }

  const clientId = req.userId!;
  const data = {
    title,
    description,
    status,
    clientId,
    createdAt: new Date(),
    updatedAt: new Date(),
    lawyerId: null,
  };
  try {
    const createdCase = await prismaCase.createCase(data);

    res.status(201).json({ ...createdCase, id: createdCase.id.toString() });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};
//  update Case ('CLIENT' req)
export const updateCaseHandler = async (
  req: RequestWithCase,
  res: Response,
) => {
  const ok = checkForUser(req, res);
  if (!ok) {
    return;
  }
  const data = req.body;
  const { id } = req.params;
  const BigIntId = BigInt(id);
  try {
    const error = validateCaseData(data);
    if (error) {
      return res.status(403).json({ error: error.message });
    }
    //  ready to be updated
    const newData: Case = {
      id: BigIntId,
      ...data,
      clientId: req.userId as string,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    const updatedCase = await prismaCase.updateCase(newData, BigIntId);

    res.status(201).json({ ...updatedCase, id: updatedCase.id.toString() });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};
export const deleteCaseHandler = async (
  req: RequestWithCase,
  res: Response,
) => {
  const { id } = req.params;
  const ok = checkForUser(req, res);
  if (!ok) {
    return;
  }
  try {
    const deletedCase = await prismaCase.deleteCase(
      BigInt(id),
      req.userId as string,
    );
    res.status(201).json({
      message: `case has been deleted successfully with id ${deletedCase.id.toString()}`,
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};
export const getCasesHandler = async (req: RequestWithUser, res: Response) => {
  try {
    const getAllCases = await prismaCase.getCases();

    res.status(201).json({
      getAllCases,
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};

export const getCaseByID = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const caseByID = await prismaCase.getCaseByID(BigInt(id));
    res.status(201).json({
      caseByID,
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};
