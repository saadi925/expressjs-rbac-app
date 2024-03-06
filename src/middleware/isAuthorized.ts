import { PrismaCaseRequest } from '../../prisma/queries/CaseRequests';
export async function areFriends(
  userId: string,
  friendId: string,
): Promise<boolean> {
  try {
    // Query the database to check if there is a friendship entry between the two users
    const prisma = new PrismaClient();
    const friendship = await prisma.friendship.findFirst({
      where: {
        AND: [{ userId }, { friendId }],
      },
    });
    // Return true if friendship exists, false otherwise
    return friendship !== null;
  } catch (error) {
    console.error('Error checking friendship:', error);
    throw new Error('Failed to check friendship');
  }
}
import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

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
    const { caseId, receiverId } = socket.handshake.query;
    const userId = socket.userId;
    if (!userId || typeof userId !== 'string') {
      throw new Error('user is unauthorized , try again later');
    }
    if (!receiverId || typeof receiverId !== 'string') {
      throw new Error('no reciever provided');
    }
    const { userRole } = socket;

    // Check if the sender and receiver are friends
    const areFriend = await areFriends(userId, receiverId);

    // Instantiate PrismaCaseRequest
    const prismaCaseRequest = new PrismaCaseRequest();

    // Retrieve case request based on user role
    let caseRequest;
    if (areFriend) {
      next();
    } else {
      if (!caseId || typeof caseId !== 'string') {
        throw new Error("Case ID is required for lawyer's role.");
      }
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
      if ((!caseRequest || caseRequest.status !== 'ACCEPTED') && !areFriend) {
        throw new Error('User is not authorized to perform this action.');
      }
    }

    // User is authorized
    next();
  } catch (error) {
    console.error('Error in isAuthorizedSocket:', error);
    next(error);
  }
};
