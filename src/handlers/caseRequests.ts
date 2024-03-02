import { Response } from 'express';
import { PrismaCaseRequest } from '../../prisma/queries/CaseRequests';
import { RequestWithUser } from 'types/profile';

const prismaCaseRequest = new PrismaCaseRequest();
export async function createCaseRequestHandler(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const { userId, userRole } = req;
    let clientId: string | undefined;
    let lawyerId: string | undefined;
    const {
      caseId,
      clientId: requestBodyClientId,
      lawyerId: requestBodyLawyerId,
    } = req.body;

    // Check if clientId is provided in the request body
    if (requestBodyClientId) {
      clientId = requestBodyClientId;
    }

    // If the user role is CLIENT, assign userId as clientId and lawyerId from the request body
    if (userRole === 'CLIENT' && userId) {
      clientId = userId;
      lawyerId = requestBodyLawyerId;
    }

    // Validate that lawyerId is provided in the request body
    if (userRole === 'LAWYER' && userId) {
      lawyerId = userId;
      if (!requestBodyClientId) {
        return res.status(400).json({
          error: 'clientId is required for a lawyer to create a case request',
        });
      }
    }

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

    res.status(201).json(caseRequest);
  } catch (error) {
    console.error('Error creating case request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function acceptCaseRequestHandler(
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const requestId = BigInt(req.params.requestId);
    await prismaCaseRequest.acceptCaseRequest(requestId);

    // Update lawyer's cases
    await prismaCaseRequest.updateLawyerCases(req.userId as string, requestId);

    // Update client's cases if the user is a lawyer
    if (req.userRole === 'LAWYER') {
      const caseRequest = await prismaCaseRequest.getCaseRequestById(requestId);
      if (caseRequest) {
        await prismaCaseRequest.updateClientCases(
          caseRequest.clientId,
          requestId,
        );
      }
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
): Promise<void> {
  try {
    const requestId = BigInt(req.params.requestId);
    await prismaCaseRequest.rejectCaseRequest(requestId);
    res.status(204).send();
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
): Promise<void> {
  try {
    const requestId = BigInt(req.params.requestId);
    await prismaCaseRequest.cancelCaseRequest(requestId);
    res.status(204).send();
  } catch (error) {
    console.error('Error cancelling case request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
