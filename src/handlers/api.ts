import { CaseStatus } from '@prisma/client';
import { checkForUser } from './rbacMiddleware';
import { RequestWithUser } from 'types/profile';
import { Response } from 'express';
import { PrismaFriendship } from '../../prisma/queries/FriendShip';
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

export async function getAllFriendshipsByUserId(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const isOk = checkForUser(req, res);
    if (!isOk) {
      return;
    }
    const { userId } = req;
    const prismaFriendship = new PrismaFriendship();

    // Call the method to retrieve all friendships by user ID
    const friendships = await prismaFriendship.getFriendshipsForUser(
      userId as string,
    );

    // Send the friendships as a JSON response
    res.status(200).json(friendships);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error retrieving friendships:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
