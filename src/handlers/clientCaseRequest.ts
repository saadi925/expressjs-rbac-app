import { Response } from 'express';
import { PrismaCaseRequest } from '../../prisma/queries/CaseRequests';
import { RequestWithUser } from 'types/profile';
import { CaseNotifications } from '../../notifications/CaseNotifications';
import { PrismaCase } from '../../prisma';
import { NotificationData } from 'prisma/queries/Notifications';

const prismaCaseRequest = new PrismaCaseRequest();
const notifier = new CaseNotifications();
const prismaCase = new PrismaCase();
export async function createCaseRequestClientHandler(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const { userId } = req;
    let clientId: string | undefined;
    let lawyerId: string | undefined;
    const { caseId, lawyerId: requestBodyLawyerId } = req.body;
    clientId = userId;
    lawyerId = requestBodyLawyerId;
    if (!caseId) {
      return res.status(400).json({ error: 'caseId is required' });
    }
    const bigintCaseId = BigInt(caseId);
    const caseRequest = await prismaCaseRequest.createCaseRequest({
      clientId: clientId!,
      lawyerId: lawyerId!,
      caseId: bigintCaseId,
    });
    await prismaCaseRequest.addToSenderSentRequests(
      caseRequest.id,
      clientId as string, // client id is sender's id
    );
    await prismaCaseRequest.addToRecieverRecieveRequests(
      caseRequest.id,
      lawyerId as string,
    );
    const notifyData: Omit<NotificationData, 'message'> = {
      userId: caseRequest.lawyerId,
      avatarUrl: caseRequest.client?.profile?.avatar || '',
      name: caseRequest.client?.name ?? 'Anonymous',
    };
    await notifier.caseRequestNotifyLawyer(notifyData);
    res.status(201).json(caseRequest);
  } catch (error) {
    console.error('Error creating case request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function acceptCaseRequestClientHandler(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const userId = req.userId;
    if (!userId || typeof userId !== 'string') {
      res.status(401).send({
        error: `Unauthorized`,
      });
      return;
    }
    const requestId = BigInt(req.params.requestId);
    const caseRequest = await prismaCaseRequest.getCaseRequestById(requestId);
    if (!caseRequest || caseRequest.status !== 'PENDING') {
      res.status(404).send({
        error: `case request is Not there anymore`,
      });
      return;
    }
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
    await prismaCaseRequest.acceptCaseRequest(requestId);
    if (req.userRole == 'LAWYER') {
      // Update lawyer's cases
      await prismaCaseRequest.updateLawyerCases(
        req.userId as string,
        requestId,
      );
      // Update client's cases if the user is a lawyer
      await prismaCaseRequest.updateClientCases(
        caseRequest.clientId,
        requestId,
      );
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
      await notifier.caseAssignedNotifyLawyer(
        updatedCase.title,
        notifyLawyerData,
      );
      await notifier.caseAssignedNotifyClient(
        updatedCase.title,
        notifyLawyerData,
      );
    } else {
      await prismaCaseRequest.updateLawyerCases(
        caseRequest.lawyerId,
        requestId,
      );
      await prismaCaseRequest.updateClientCases(
        req.userId as string,
        requestId,
      );
      // lawyer is sender here , client is reciever
      await prismaCaseRequest.removeRequestFromSenderSent(
        caseRequest.id,
        caseRequest.lawyerId,
      );
      await prismaCaseRequest.addToRecieverRecieveRequests(
        caseRequest.id,
        caseRequest.clientId,
      );
      const status = 'ASSIGNED';
      const updatedCase = await prismaCase.addLawyerToCase(
        caseRequest.lawyerId,
        req.userId as string,
        caseRequest.caseId,
        status,
      );
      await notifier.caseAssignedNotifyLawyer(
        updatedCase.title,
        notifyLawyerData,
      );
      await notifier.caseAssignedNotifyClient(
        updatedCase.title,
        notifyClientData,
      );
    }

    res.status(204).json({
      message: `you have accepted the case request`,
    });
  } catch (error) {
    console.error('Error accepting case request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function rejectCaseRequestHandler(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const requestId = BigInt(req.params.requestId);
    const caseRequest = await prismaCaseRequest.getCaseRequestById(requestId);
    if (!caseRequest || caseRequest.status !== 'PENDING') {
      return res.status(404).send({
        error: `case request is not there anymore`,
      });
    }
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
    await prismaCaseRequest.rejectCaseRequest(requestId);
    if (req.userRole == 'LAWYER') {
      //  here req is rejected by lawyer so we are notifying the client
      await notifier.caseRequestRejectedNotify(notifyClientData);
    } else {
      await notifier.caseRequestRejectedNotify(notifyLawyerData);
    }
    res.status(204).send(caseRequest);
  } catch (error) {
    console.error('Error rejecting case request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPendingCaseRequestsHandler(
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const { userId } = req; // userId is lawyer id here
    const pendingRequests =
      await prismaCaseRequest.getPendingCaseRequestsByLawyer(userId as string);
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error getting pending case requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function cancelCaseRequestHandler(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const requestId = BigInt(req.params.requestId);
    const caseRequest = await prismaCaseRequest.getCaseRequestById(requestId);
    // only the request sender can cancel the request.

    if (!caseRequest || caseRequest.status !== 'PENDING') {
      return res.status(404).send({
        error: `case request is Not there anymore`,
      });
    }
    await prismaCaseRequest.cancelCaseRequest(requestId);
    res.status(204).send();
  } catch (error) {
    console.error('Error cancelling case request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
