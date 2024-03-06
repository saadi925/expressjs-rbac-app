import { Response } from 'express';
import { validationResult } from 'express-validator';
import {
  LawyerProfileData,
  PrismaLawyerProfile,
} from '../../prisma/queries/LawyerProfile';
import {
  isValidEmail,
  isValidPhoneNumber,
  isValidUrl,
} from '../../src/middleware/validator';
import { RequestWithUser } from 'types/profile';
const lawyerProfile = new PrismaLawyerProfile();
export const createOrUpdateLawyerProfile = async (
  req: RequestWithUser,
  res: Response,
) => {
  // Validate request body using Express Validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.userId as string;
  try {
    const {
      bio,
      experience,
      education,
      phoneNumber,
      facebook,
      linkedin,
      instagram,
      specialization,
      status,
      phone,
      email,
      description,
    } = req.body;

    // Validate profile links
    if (facebook && !isValidUrl(facebook)) {
      return res.status(400).json({ message: 'Invalid Facebook profile link' });
    }
    if (linkedin && !isValidUrl(linkedin)) {
      return res.status(400).json({ message: 'Invalid LinkedIn profile link' });
    }
    if (instagram && !isValidUrl(instagram)) {
      return res
        .status(400)
        .json({ message: 'Invalid Instagram profile link' });
    }

    // Validate phone number
    if (phone && !isValidPhoneNumber(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Validate email
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const data: LawyerProfileData = {
      bio,
      experience,
      description,
      education,
      phoneNumber,
      facebook,
      linkedin,
      instagram,
      specialization,
      status,
      userId,
      phone,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const profile = await lawyerProfile.createOrUpdateLawyerProfile(data);
    res.status(201).json({ profile });
  } catch (error) {
    console.error('Error creating lawyer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLawyerProfile = async (req: RequestWithUser, res: Response) => {
  const userId = req.userId as string;
  try {
    const profile = await lawyerProfile.getLawyerProfileById(userId);
    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching lawyer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
