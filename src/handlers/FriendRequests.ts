import { Request, Response } from 'express';
import { PrismaFriendRequest } from '../../prisma/queries/FriendRequest';
import { RequestWithUser } from 'types/profile';

const prismaFriendRequest = new PrismaFriendRequest();

export async function sendFriendRequestHandler(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const { userId } = req;
    const { receiverId } = req.body;

    // Validate receiverId
    if (!receiverId || typeof receiverId !== 'string') {
      return res.status(400).json({ error: 'Invalid receiverId' });
    }

    // Check if receiverId exists in the database
    const receiverExists = await prismaFriendRequest.userExists(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ error: 'Receiver user not found' });
    }

    const friendRequest = await prismaFriendRequest.sendFriendRequest(
      userId as string,
      receiverId,
    );
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
export async function acceptFriendRequestHandler(
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const requestId = BigInt(req.params.requestId);
    await prismaFriendRequest.acceptFriendRequest(requestId);
    res.status(204).send();
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function rejectFriendRequestHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const requestId = BigInt(req.params.requestId);
    await prismaFriendRequest.rejectFriendRequest(requestId);
    res.status(204).send();
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function cancelFriendRequestHandler(
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const requestId = BigInt(req.params.requestId);
    await prismaFriendRequest.cancelFriendRequest(requestId);
    res.status(204).send();
  } catch (error) {
    console.error('Error canceling friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPendingFriendRequestsHandler(
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const { userId } = req;
    const pendingRequests = await prismaFriendRequest.getPendingFriendRequests(
      userId as string,
    );
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error retrieving pending friend requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
