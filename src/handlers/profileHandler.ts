import { Response } from 'express';
import {
  ProfileCredentials,
  RequestWithProfile,
  RequestWithUser,
} from 'types/profile';
import { validateProfileCredentials } from '../middleware/validateProfile';
import { checkForUser } from './rbacMiddleware';
import { PrismaProfile } from 'prisma';

const primsaProfile = new PrismaProfile();
// creates a profile for a user
//  req.body: { location, bio, avatar, displayname }
export const createProfile = async (req: RequestWithProfile, res: Response) => {
  try {
    const { location, bio, avatar, displayname } = req.body;
    const { userId } = req;
    const ok = checkForUser(req, res);
    if (!ok) {
      return;
    }
    const error = validateProfileCredentials(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const data: ProfileCredentials = {
      location,
      bio,
      avatar,
      displayname,
    };
    const profile = await primsaProfile.createProfile(data, userId!);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};

// updates a profile for an authenticated user
//  req.body: { location, bio, avatar, displayname }
export const updateProfileHandler = async (
  req: RequestWithProfile,
  res: Response,
) => {
  try {
    const { location, bio, avatar, displayname } = req.body;
    const ok = checkForUser(req, res);
    if (!ok) {
      return;
    }
    const error = validateProfileCredentials(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const data: ProfileCredentials = {
      location,
      bio,
      avatar,
      displayname,
    };
    const profile = await primsaProfile.updateProfile(
      req.userId as string,
      data,
    );
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};

// gets a profile for an authenticated user
export const getUserProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const { userId } = req;
    const ok = checkForUser(req, res);
    if (!ok) {
      return;
    }
    const profile = await primsaProfile.getProfile(userId as string);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};

export const deleteUserProfile = async (
  req: RequestWithUser,
  res: Response,
) => {
  try {
    const { userId } = req;
    const deletedProfile = await primsaProfile.deleteProfile(userId as string);
    res.status(200).json({
      message: `the profile has been deleted successfully with the user id ${deletedProfile.id.toString()}`,
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
    console.log(error);
  }
};
