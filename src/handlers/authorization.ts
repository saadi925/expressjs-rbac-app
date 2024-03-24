import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestWithUser } from 'types/profile';

const prisma = new PrismaClient();
const SCREENS = {
  LOGIN: 'Login',
  CREATE_PROFILE: 'Create Profile',
  CONTACT: 'Contact',
  LAWYER_PROFILE: 'Lawyer Profile',
  APP: 'App',
};

export const authorizeAction = async (req: RequestWithUser, res: Response) => {
  const userId = req.userId;
  try {
    const isLawyer = req.userRole === 'LAWYER';
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, lawyerProfile: isLawyer ? true : false },
    });

    if (!user) {
      res
        .status(403)
        .json({ message: 'Unauthorized', redirect: SCREENS.LOGIN });
      return;
    }
    if (!user.profile) {
      res
        .status(403)
        .json({ message: 'Unauthorized', redirect: SCREENS.CREATE_PROFILE });
      return;
    }
    if (user.role === 'LAWYER') {
      if (!user.lawyerProfile) {
        res
          .status(403)
          .json({ message: 'Unauthorized', redirect: SCREENS.LAWYER_PROFILE });
        return;
      }
    }

    return res.status(200).json({
      message: 'Authorized',
      redirect: SCREENS.APP,
      user: {
        avatar: user.profile.avatar,
        displayname: user.profile.displayname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error authorizing action:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
