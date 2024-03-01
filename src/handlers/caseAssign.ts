import { Response } from 'express';
import { PrismaCase } from '../../prisma/queries/cases';
import { RequestWithUser } from 'types/profile';
import { CaseNotifications } from '../../notifications/CaseNotifications';

const prismaCase = new PrismaCase();

export const assignCaseToLawyer = async (
  req: RequestWithUser,
  res: Response,
) => {
  try {
    const { userRole } = req;
    const notifier = new CaseNotifications();
    if (userRole == 'LAWYER') {
      const { caseId, clientId, status } = req.body;
      if (!caseId || !clientId) {
        return res
          .status(400)
          .json({ error: 'Both case and client must be provided' });
      }
      const updatedCase = await prismaCase.addLawyerToCase(
        req.userId as string,
        clientId,
        caseId,
        status,
      );
      let notification;
      if (updatedCase.lawyer?.name) {
        notification = notifier.caseAssignedNotifyLawyer(
          updatedCase.title.slice(0, 32),
          updatedCase.lawyer?.name,
          req.userId as string,
        );
      } else {
        notification = 'Case assigned to lawyer successfully';
      }

      res.status(200).json({
        message: notification,
        case: updatedCase,
      });
    } else {
      const { caseId, lawyerId, status } = req.body;
      if (!caseId || !lawyerId) {
        return res
          .status(400)
          .json({ error: 'Both case and lawyer must be provided' });
      }
      const updatedCase = await prismaCase.addLawyerToCase(
        lawyerId,
        req.userId as string,
        caseId,
        status,
      );
      let notification;
      if (updatedCase.lawyer?.name) {
        notification = notifier.caseAssignedNotifyClient(
          updatedCase.title.slice(0, 32),
          updatedCase.lawyer?.name,
          req.userId as string,
        );
      } else {
        notification = 'Case assigned to lawyer successfully';
      }

      res.status(200).json({
        message: notification,
        case: updatedCase,
      });
    }
  } catch (error) {
    console.error('Error assigning case to lawyer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
