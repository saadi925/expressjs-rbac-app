import { Response } from 'express';
import { PrismaCase } from '../../prisma/queries/cases';
import { RequestWithUser } from 'types/profile';
import { CaseNotifications } from '../../notifications/CaseNotifications';

const prismaCase = new PrismaCase();
// LAWYER caseId, clientId, status
// CLIENT caseId, lawyerId, status
export const assignCaseToLawyer = async (
  req: RequestWithUser,
  res: Response,
) => {
  try {
    const { userRole } = req;
    const notifier = new CaseNotifications();
    let caseId, clientId, lawyerId, status;

    if (userRole === 'LAWYER') {
      ({ caseId, clientId, status } = req.body);
    } else {
      ({ caseId, lawyerId, status } = req.body);
    }

    if (
      !caseId ||
      (userRole === 'LAWYER' && !clientId) ||
      (userRole !== 'LAWYER' && !lawyerId)
    ) {
      return res.status(400).json({
        error:
          userRole === 'LAWYER'
            ? 'Both case and client must be provided'
            : 'Both case and lawyer must be provided',
      });
    }

    const updatedCase = await prismaCase.addLawyerToCase(
      userRole === 'LAWYER' ? (req.userId as string) : lawyerId,
      userRole !== 'LAWYER' ? (req.userId as string) : clientId,
      caseId,
      status,
    );

    let message;
    const lawyerData = {
      name: updatedCase.client.name ?? 'Anonymous',
      userId: lawyerId,
      avatarUrl: updatedCase.lawyer?.profile?.avatar || '',
    };
    const clientData = {
      name: updatedCase.lawyer?.name ?? 'Anonymous',
      userId: clientId,
      avatarUrl: updatedCase.client?.profile?.avatar || '',
    };

    // notify lawyer that case has been assigned to him
    const lawyerNotification = await notifier.caseAssignedNotifyLawyer(
      updatedCase.title,
      lawyerData,
    );
    // notify client that case has been assigned to lawyer
    const clientNotification = await notifier.caseAssignedNotifyClient(
      updatedCase.title,
      clientData,
    );
    if (userRole == 'LAWYER') {
      message = lawyerNotification;
    } else {
      message = clientNotification;
    }
    res.status(200).json({
      message,
      case: updatedCase,
    });
  } catch (error) {
    console.error('Error assigning case to lawyer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
