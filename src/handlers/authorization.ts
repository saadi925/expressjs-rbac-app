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
      return res
        .status(403)
        .json({ message: 'Unauthorized', redirect: SCREENS.LOGIN });
    }
    if (!user.profile) {
      return res
        .status(403)
        .json({ message: 'Unauthorized', redirect: SCREENS.CREATE_PROFILE });
    }
    if (user.role === 'LAWYER') {
      if (!user.lawyerProfile) {
        return res
          .status(403)
          .json({ message: 'Unauthorized', redirect: SCREENS.LAWYER_PROFILE });
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
