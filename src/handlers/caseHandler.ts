import { Response } from 'express';
import { PrismaCase, prisma } from '../../prisma';
import { RequestWithCase } from 'types/case';
import { $Enums, Case } from '@prisma/client';
import { validateCaseData } from '../../src/middleware/validateCaseData';
import { checkForUser } from '../middleware/rbacMiddleware';
import { RequestWithUser } from 'types/profile';
import { CaseNotifications } from '../../notifications/CaseNotifications';
const prismaCase = new PrismaCase();
const notifier = new CaseNotifications();
//  this is the case creation handler , only 'CLIENT' can create the case,
export const createCaseHandler = async (
  req: RequestWithCase,
  res: Response,
) => {
  const { title, description, category } = req.body;
  const ok = checkForUser(req, res);
  if (!ok) {
    return;
  }
  const error = validateCaseData(req.body);
  if (error) {
    return res.status(403).json({ error: error.message });
  }
  const status: $Enums.CaseStatus = 'OPEN';
  const clientId = req.userId!;
  const data = {
    title,
    description,
    clientId,
    createdAt: new Date(),
    updatedAt: new Date(),
    lawyerId: null,
    category,
    status,
  };
  try {
    const createdCase = await prismaCase.createCase(data);

    await notifier.caseCreation(createdCase.title.slice(0, 32), {
      userId: req.userId as string,
    });

    res.status(201).json({ ...createdCase, id: createdCase.id.toString() });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};
export async function getAllOpenCases(req: RequestWithUser, res: Response) {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }
    const cases = await prismaCase.getAllOpenCases(userId as string);
    if (cases.length === 0) {
      return res.status(404).json({
        error: 'No Open Cases Found',
      });
    }
    const serialized = cases.map((caseItem) => ({
      ...caseItem,
      id: String(caseItem.id),
    }));
    res.status(200).json(serialized);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
}
//  update Case ('CLIENT' req)
// 'id' in params
// 'case in body
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
    const exists = await prismaCase.caseExists(BigIntId);
    if (!exists) {
      return res.status(404).json({
        error: 'Case Not Found',
      });
    }
    //  ready to be updated
    const newData: Omit<Case, 'status'> = {
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
    const exists = await prismaCase.caseExists(BigInt(id));
    if (!exists) {
      return res.status(404).json({
        error: 'Case Not Found',
      });
    }
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
    const getAllCases = await prismaCase.getCases(req.userId as string);
    const serialized = getAllCases.map((caseItem) => ({
      ...caseItem,
      id: String(caseItem.id),
    }));

    res.status(200).json(serialized);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};

export const getCaseByID = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const exists = await prismaCase.caseExists(BigInt(id));
    if (!exists) {
      return res.status(404).json({
        error: 'Case Not Found',
      });
    }
    const caseByID = await prismaCase.getCaseByID(BigInt(id));
    res.status(201).json({
      caseByID,
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};
//  body 'status'
// params 'id'
export async function updateCaseStatus(req: RequestWithUser, res: Response) {
  const ok = checkForUser(req, res);
  if (!ok) {
    return;
  }
  const { id } = req.params;
  const { status } = req.body;
  try {
    const exists = await prismaCase.caseExists(BigInt(id));
    if (!exists) {
      return res.status(404).json({
        error: 'Case Not Found',
      });
    }
    const updatedCase = await prismaCase.updateCaseStatus(
      status,
      BigInt(id),
      req.userId as string,
    );
    res.status(201).json({ ...updatedCase, id: updatedCase.id.toString() });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
}
