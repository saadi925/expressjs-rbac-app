import { Response } from 'express';
import {
  ProfileCredentials,
  RequestWithProfile,
  RequestWithUser,
} from 'types/profile';
import { validateProfileCredentials } from '../middleware/validateProfile';
import { checkForUser } from '../middleware/rbacMiddleware';
import { PrismaDBProfile } from '../../prisma/queries/profile';

const primsaProfile = new PrismaDBProfile();
// creates a profile for a user
//  req.body: { location, bio, avatar, displayname,phone }
export const createProfile = async (req: RequestWithProfile, res: Response) => {
  try {
    const { location, bio, displayname, phone } = req.body;
    const { userId } = req;
    const ok = checkForUser(req, res);
    if (!ok) {
      return;
    }
    const avatar =
      'https://images.unsplash.com/photo-1599566147214-ce487862ea4f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D';
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
      phone,
    };
    console.log(avatar);
    // [{"fileName": "20240308_133040.jpg", "fileSize": 2941227, "height": 3054, "originalPath": "/storage/emulated/0/DCIM/Camera/20240308_133040.jpg", "type": "image/jpeg", "uri": "file:///data/user/0/com.awesomeproject/cache/rn_image_picker_lib_temp_33481401-6fc4-4860-9948-3b95ab7bf390.jpg", "width": 2290}]

    // const profile = await primsaProfile.createProfile(data, userId!);
    // res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  }
};

// updates a profile for an authenticated user
//  req.body: { location, bio, avatar, displayname,phone }
export const updateProfileHandler = async (
  req: RequestWithProfile,
  res: Response,
) => {
  try {
    const { location, bio, avatar, displayname, phone } = req.body;
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
      phone,
    };
    const profile = await primsaProfile.updateProfile(
      req.userId as string,
      data,
    );
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  }
};

export const getUserProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const { userId } = req;
    const ok = checkForUser(req, res);
    if (!ok) {
      return;
    }
    const profile = await primsaProfile.getProfileWithRole(userId as string);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  }
};
