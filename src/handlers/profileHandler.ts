import { Response } from 'express';
import fs from 'fs'
import {
  ProfileCredentials,
  RequestWithUser,
} from 'types/profile';
import { validateProfileCredentials } from '../middleware/validateProfile';
import { checkForUser } from '../middleware/rbacMiddleware';
import { PrismaDBProfile } from '../../prisma/queries/profile';

const primsaProfile = new PrismaDBProfile();
// creates a profile for a user
//  req.body: { location, bio, avatar, displayname,phone }
export const uploadAvatar = async (req : RequestWithUser, res : Response) => {
  try {
    // Check if file was uploaded via multer
    if (req.file) {
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      return res.status(200).json({ message: 'File uploaded successfully', avatarPath });
    }

    // Check if avatar data is provided in the request body
    const base64Avatar = req.body.avatar;
    if (!base64Avatar) {
      return res.status(400).json({ error: 'No file uploaded or avatar data provided' });
    }

    // Convert the base64 avatar data to a buffer
    const buffer = Buffer.from(base64Avatar, 'base64');

    // Save the avatar data to a file
    const filename = 'avatar.png'; // You may want to generate a unique filename
    fs.writeFileSync(`uploads/avatars/${filename}`, buffer);

    const avatarPath = `/uploads/avatars/${filename}`;
    res.status(200).json({ message: 'Avatar uploaded successfully', avatarPath });
  } catch (err) {
    console.error('Error uploading avatar:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
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
