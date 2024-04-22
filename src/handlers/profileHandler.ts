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
export const uploadAvatar = async (req : RequestWithUser, res: Response) =>{
  try {
    if (!req.file) {
      res.status(400).send({ error: 'No file uploaded' });
      return;
    }
    const avatar = `/uploads/avatars/${req.file.filename}`;
    res.status(200).send({ message: 'File uploaded successfully', avatar });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server error' });
  }
}
export const createOrUpdateProfile = async (req: any, res: Response) => {
  try {
      const { location, bio, displayname, phone ,avatar} = req.body;
      const { userId } = req;

      // Validate profile credentials
      const error = validateProfileCredentials(req.body);
      if (error) {
          return res.status(400).json({ error: error.message });
      }

      // If avatar image is uploaded, save the filename to the profile data
     

      const data: ProfileCredentials = {
          location,
          bio,
          avatar,
          displayname,
          phone,
      };

      // Check if a profile for the user already exists
      const existingProfile = await primsaProfile.getProfileWithRole(userId);

      let profile;
      if (existingProfile) {
          // Update existing profile
          profile = await primsaProfile.updateProfile(userId, data);
      } else {
          // Create new profile
          profile = await primsaProfile.createProfile(data, userId!);
      }
      return res.status(201).json(profile);
  } catch (error) {
      // Handle internal server errors
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// updates a profile for an authenticated user
//  req.body: { location, bio, avatar, displayname,phone }
export const updateProfileHandler = async (
  req: RequestWithProfile,
  res: Response,
) => {
  try {
    const { location, bio, displayname, phone } = req.body;
    const ok = checkForUser(req, res);
    if (!ok) {
      return;
    }
    const error = validateProfileCredentials(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    const avatar =
      'https://images.unsplash.com/photo-1599566147214-ce487862ea4f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D';
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
