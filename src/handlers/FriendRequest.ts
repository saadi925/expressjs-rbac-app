import express, { Response } from 'express';
import { PrismaFriendRequest } from '../../prisma/queries/FriendRequest';
import { PrismaFriendship } from '../../prisma/queries/FriendShips';
import { RequestWithUser } from 'types/profile';
import { prisma } from '../../prisma/queries/index';

const app = express();
app.use(express.json());

const friendship = new PrismaFriendship();
const friendRequest = new PrismaFriendRequest();

// app.delete('/friendship/remove',
export async function removeFriend(req: RequestWithUser, res: Response) {
  try {
    const { userId } = req;
    const { requestId } = req.body;
    //  get friend by request id
    const friendId = await friendRequest.getFriendByRequestId(
      requestId,
      userId!,
    );
    await friendship.removeFriend(userId!, friendId);
    res.status(200).json({
      message: `friend removed successfully `,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}

export async function getFriends(req: RequestWithUser, res: Response) {
  try {
    if (!req.userId || typeof req.userId !== 'string') {
      res.status(401).json({ error: 'UnAuthorized' });
      return;
    }
    const friends = await friendRequest.getAcceptedFriends(req.userId!);
    res.status(200).json(friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}

// FriendRequest routes
export async function sendFriendRequest(req: RequestWithUser, res: Response) {
  try {
    const userId = req.userId as string;
    const { caseId } = req.params;
    const clientCase = await prisma.case.findUnique({
      where: { id: BigInt(caseId) },
    });
    if (!clientCase) {
      res.status(404).json({
        error: 'Case not found',
      });
      return;
    }
    const receiverId = clientCase.clientId;
    if (receiverId === userId) {
      res.status(400).json({
        error: 'You cannot send a friend request to yourself',
      });
      return;
    }
    //  if friend request already exists
    const existingRequest = await friendRequest.checkIfFriendRequestExists(
      userId,
      receiverId,
    );
    if (existingRequest) {
      res.status(400).json({error : 'Friend Request already exists'})
      return;
    }
    const request = await friendRequest.sendFriendRequest(userId, receiverId);
    await friendRequest.addToSent(userId, request.id);
    await friendRequest.addToReceived(receiverId, request.id);
    res.status(200).json({ message: 'friend request sent' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}


// FriendRequest routes
export async function sendFriendRequestToLawyer(req: RequestWithUser, res: Response) {
  try {
    const userId = req.userId as string;
    const { profileId } = req.params;
    const lawyerProfile = await prisma.lawyerProfile.findUnique({
      where: { id : profileId },
    });
    if (!lawyerProfile) {
      res.status(404).json({
        error: 'Lawyer not found',
      });
      return;
    }
    const receiverId = lawyerProfile?.id;
    if (receiverId === userId) {
      res.status(400).json({
        error: 'You cannot send a friend request to yourself',
      });
      return;
    }
    //  if friend request already exists
    const existingRequest = await friendRequest.checkIfFriendRequestExists(
      userId,
      receiverId,
    );
    if (existingRequest) {
      res.status(400).json({error : 'Friend Request already exists'})
      return;
    }
    const request = await friendRequest.sendFriendRequest(userId, receiverId);
    await friendRequest.addToSent(userId, request.id);
    await friendRequest.addToReceived(receiverId, request.id);
    res.status(200).json({ message: 'friend request sent' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}
export async function acceptFriendRequest(req: RequestWithUser, res: Response) {
  try {
    const { requestId } = req.params;
    const receiverId = req.userId as string;
    const request = await friendRequest.acceptFriendRequest(
      BigInt(requestId),
      receiverId,
    );
    await friendship.addFriend(receiverId, request.userId);

    res.status(200).json({ message: 'you have accepted the friend request' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}
export async function rejectFriendRequest(req: RequestWithUser, res: Response) {
  try {
    const { requestId } = req.params;
    const receiverId = req.userId as string;
    await friendRequest.rejectFriendRequest(BigInt(requestId), receiverId);
    res.status(200).json({ message: 'you have rejected the friend request' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}
export async function getRecievedRequests(req: RequestWithUser, res: Response) {
  try {
    const userId = req.userId as string;
    const requests = await friendRequest.getFriendRequests(userId);
    if (requests.length == 0) {
      res.status(404).json({
        error: 'No Recieved Requests Found',
      });
      return;
    }
    const serialized = requests.map((friendRequest) => ({
      ...friendRequest,
      id: String(friendRequest.id),
    }));
    res.status(200).json(serialized);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}

export async function getSentFriendRequests(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const userId = req.userId as string;
    const requests = await friendRequest.getSentFriendRequests(userId);
    if (requests.length == 0) {
      res.status(404).json({
        error: 'No Sent FriendRequests Found',
      });
      return;
    }
    const serialized = requests.map((friendRequest) => ({
      ...friendRequest,
      id: String(friendRequest.id),
    }));
    res.status(200).json(serialized);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}
export async function cancelFriendRequest(req : RequestWithUser, res : Response) {
  try {
    const userId = req.userId!
    const {requestId} = req.params
    const cancel = friendRequest.cancelFriendRequest(userId, BigInt(requestId))
    res.status(200).json({ message: 'request cancelled successfully' });
  } catch (error) {
    
  }
}