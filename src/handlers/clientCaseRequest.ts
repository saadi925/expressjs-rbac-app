import { Response } from 'express';
import { PrismaCaseRequest } from '../../prisma/queries/CaseRequests';
import { RequestWithUser } from 'types/profile';
import { CaseNotifications } from '../../notifications/CaseNotifications';
import { PrismaCase } from '../../prisma';

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

    // If the user role is CLIENT, assign userId as clientId and lawyerId from the request body
    clientId = userId;
    lawyerId = requestBodyLawyerId;

    // Validate that caseId is provided in the request body
    if (!caseId) {
      return res.status(400).json({ error: 'caseId is required' });
    }

    // Convert caseId to BigInt
    const bigintCaseId = BigInt(caseId);

    const caseRequest = await prismaCaseRequest.createCaseRequest({
      clientId: clientId!,
      lawyerId: lawyerId!,
      caseId: bigintCaseId,
    });
    // we notify lawyer when client sent a case request
    // here sender is client
    await prismaCaseRequest.addToSenderSentRequests(
      caseRequest.id,
      clientId as string, // client id is sender's id
    );
    await prismaCaseRequest.addToRecieverRecieveRequests(
      caseRequest.id,
      lawyerId as string,
    );
    await notifier.caseRequestNotifyLawyer(
      caseRequest.client?.name ?? 'Anonymous',
      lawyerId as string,
    );
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
        updatedCase.client.name ?? 'Anonymous',
        req.userId as string,
      );
      await notifier.caseAssignedNotifyClient(
        updatedCase.title,
        updatedCase.lawyer?.name ?? 'Anonymous',
        updatedCase.clientId,
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
        updatedCase.client.name ?? 'Anonymous',
        req.userId as string,
      );
      await notifier.caseAssignedNotifyClient(
        updatedCase.title,
        updatedCase.lawyer?.name ?? 'Anonymous',
        updatedCase.clientId,
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
    await prismaCaseRequest.rejectCaseRequest(requestId);
    if (req.userRole == 'LAWYER') {
      //  here req is rejected by lawyer so we are notifying the client
      await notifier.caseRequestRejectedNotify(
        caseRequest.client?.name ?? 'Anonymous',
        caseRequest.clientId,
      );
    } else {
      await notifier.caseRequestRejectedNotify(
        caseRequest.lawyer?.name ?? 'Anonymous',
        caseRequest.lawyerId,
      );
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
