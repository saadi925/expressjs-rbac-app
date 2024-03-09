import { Response } from 'express';
import { PrismaCaseRequest } from '../../prisma/queries/CaseRequests';
import { RequestWithUser } from 'types/profile';
import { CaseNotifications } from '../../notifications/CaseNotifications';
import { PrismaCase } from '../../prisma';
import { NotificationData } from 'prisma/queries/Notifications';

const prismaCaseRequest = new PrismaCaseRequest();
const notifier = new CaseNotifications();
const prismaCase = new PrismaCase();
export async function createCaseRequestLawyerHandler(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const { userId } = req;
    let clientId: string | undefined;
    let lawyerId: string | undefined;
    const { caseId, clientId: requestBodyClientId } = req.body;
    if (requestBodyClientId) {
      clientId = requestBodyClientId;
    }
    lawyerId = userId;
    if (!requestBodyClientId) {
      return res.status(400).json({
        error: 'clientId is required for a lawyer to create a case request',
      });
    }
    if (!caseId) {
      return res.status(400).json({ error: 'caseId is required' });
    }

    const bigintCaseId = BigInt(caseId);

    const caseRequest = await prismaCaseRequest.createCaseRequest({
      clientId: clientId!,
      lawyerId: lawyerId!,
      caseId: bigintCaseId,
    });
    // add request to the sender sent request and reciever recieved requests
    // here sender is lawyer
    await prismaCaseRequest.addToSenderSentRequests(
      caseRequest.id,
      lawyerId as string,
    );

    await prismaCaseRequest.addToRecieverRecieveRequests(
      caseRequest.id,
      clientId as string,
    );
    const notifyClientData: Omit<NotificationData, 'message'> = {
      userId: caseRequest.clientId,
      avatarUrl: caseRequest.lawyer?.profile?.avatar || '',
      name: caseRequest.lawyer?.name ?? 'Anonymous',
    };
    // Notifying
    // we notify client when lawyer sent a case request
    await notifier.caseRequestNotifyClient(notifyClientData);
    res.status(201).json(caseRequest);
  } catch (error) {
    console.error('Error creating case request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function acceptCaseRequestLawyerHandler(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const requestId = BigInt(req.params.requestId);
    const caseRequest = await prismaCaseRequest.getCaseRequestById(requestId);
    if (!caseRequest || caseRequest.status !== 'PENDING') {
      return res.status(404).send({
        error: `case request is Not there anymore`,
      });
    }
    await prismaCaseRequest.acceptCaseRequest(requestId);
    // Update lawyer's cases
    await prismaCaseRequest.updateLawyerCases(req.userId as string, requestId);
    // Update client's cases if the user is a lawyer
    await prismaCaseRequest.updateClientCases(caseRequest.clientId, requestId);
    // lawyer is reciever here
    // client is sender here
    await prismaCaseRequest.removeRequestFromSenderSent(
      caseRequest.id,
      caseRequest.clientId,
    );

    await prismaCaseRequest.addToRecieverRecieveRequests(
      caseRequest.id,
      caseRequest.lawyerId,
    );

    const status = 'ASSIGNED';
    const updatedCase = await prismaCase.addLawyerToCase(
      req.userId as string,
      caseRequest.clientId,
      caseRequest.caseId,
      status,
    );
    const notifyLawyerData: Omit<NotificationData, 'message'> = {
      userId: caseRequest.lawyerId,
      avatarUrl: caseRequest.client?.profile?.avatar || '',
      name: caseRequest.client?.name ?? 'Anonymous',
    };
    const notifyClientData: Omit<NotificationData, 'message'> = {
      userId: caseRequest.clientId,
      avatarUrl: caseRequest.lawyer?.profile?.avatar || '',
      name: caseRequest.lawyer?.name ?? 'Anonymous',
    };
    await notifier.caseAssignedNotifyLawyer(
      updatedCase.title,
      notifyLawyerData,
    );
    await notifier.caseAssignedNotifyClient(
      updatedCase.title,
      notifyClientData,
    );

    res.status(204).json({
      message: `you have accepted the case request`,
    });
  } catch (error) {
    console.error('Error accepting case request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
