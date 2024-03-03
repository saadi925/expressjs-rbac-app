import { CaseStatus } from '@prisma/client';
import { checkForUser } from '../middleware/rbacMiddleware';
import { RequestWithUser } from 'types/profile';
import { Response } from 'express';
export async function getCaseStatuses(req: RequestWithUser, res: Response) {
  try {
    const isOk = checkForUser(req, res);
    if (!isOk) {
      return;
    }
    // Get all the values of the CaseStatus enum
    const caseStatuses = Object.values(CaseStatus);
    res.status(200).json({ caseStatuses });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
