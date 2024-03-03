import { NextFunction, Response } from 'express';
import { PrismaCaseRequest } from '../../prisma/queries/CaseRequests';
import { RequestWithUser } from 'types/profile';

export const isAuthorized = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  // Check if the user is involved in the case
  const { caseId } = req.params;
  const userId = req.userId;
  const prismaCaseRequest = new PrismaCaseRequest();
  const isInvolvedInCase = await prismaCaseRequest.isInvolvementInCase(
    userId as string,
    BigInt(caseId),
  );

  if (!isInvolvedInCase) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // User is authorized to send messages
  next();
};
import { Socket } from 'socket.io';

export interface SocketWithUser extends Socket {
  userId?: string;
  userRole?: string;
}

export const isAuthorizedSocket = async (
  socket: SocketWithUser,
  next: (err?: any) => void,
) => {
  try {
    // Extract necessary data from the socket payload
    const { caseId } = socket.handshake.query;
    const userId = socket.userId;
    const { userRole } = socket;

    // Validate caseId and userId
    if (
      !caseId ||
      !userId ||
      typeof caseId !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('Invalid case ID or user ID.');
    }

    // Instantiate PrismaCaseRequest
    const prismaCaseRequest = new PrismaCaseRequest();

    // Retrieve case request based on user role
    let caseRequest;
    if (userRole === 'LAWYER') {
      caseRequest = await prismaCaseRequest.getCaseRequestByCaseAndLawyer(
        BigInt(caseId),
        userId,
      );
    } else {
      caseRequest = await prismaCaseRequest.getCaseRequestByCaseAndClient(
        BigInt(caseId),
        userId,
      );
    }

    // Check if the case request exists and is accepted
    if (
      !caseRequest ||
      caseRequest.status !== 'ACCEPTED' ||
      caseRequest.case.lawyerId !== caseRequest.lawyerId ||
      caseRequest.case.clientId !== caseRequest.clientId
    ) {
      throw new Error('User is not authorized to perform this action.');
    }

    // User is authorized
    next();
  } catch (error) {
    console.error('Error in isAuthorizedSocket:', error);
    next(error);
  }
};
