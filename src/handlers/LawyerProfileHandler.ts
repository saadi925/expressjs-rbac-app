import { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaLawyerProfile } from '../../prisma/queries/LawyerProfile';

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
    const { bio, experience, education, specialization, status, description } =
      req.body;
    const data = {
      bio,
      experience,
      description,
      education,
      specialization,
      status,
      userId,
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
