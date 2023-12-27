import e, { Request, Response } from 'express';
import { getProfile, saveProfile, updateProfile } from '../../prisma';
import {
  ProfileCredentials,
  RequestWithProfile,
  RequestWithUser,
} from 'types/profile';
import { validateProfileCredentials } from '../middleware/validateProfile';

// creates a profile for a user
//  req.body: { location, bio, avatar, displayname }
export const createProfile = async (req: RequestWithProfile, res: Response) => {
  try {
    const { location, bio, avatar, displayname } = req.body;
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
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

    const profile = await saveProfile(data, req.userId);
    res.status(201).json(profile);
  } catch (error) {
    console.log('error in createProfile: ', error);
    throw new Error('Internal Server Error');
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
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
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
    const profile = await updateProfile(req.userId, data);
    res.status(201).json(profile);
  } catch (error) {
    console.log('error in updateProfileHandler: ', error);
    throw new Error('Internal Server Error');
  }
};

// gets a profile for an authenticated user
export const getUserProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const profile = await getProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    console.log('error in getProfileHandler: ', error);
    throw new Error('Internal Server Error');
  }
};
