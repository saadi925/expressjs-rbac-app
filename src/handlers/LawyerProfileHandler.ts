import { Response } from 'express';
import { validationResult } from 'express-validator';
import {
  PrismaLawyerProfile,
  LawyerProfileData,
} from '../../prisma/queries/LawyerProfile';

import { RequestWithUser } from 'types/profile';
import { PrismaLawyerContact } from '../../prisma/queries/LawyerContact';
import { LawyerContact, $Enums } from '@prisma/client';
const lawyerProfile = new PrismaLawyerProfile();
export const createOrUpdateLawyerProfile = async (
  req: RequestWithUser,
  res: Response,) => {
  // Validate request body using Express Validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const status: $Enums.AvailabilityStatus = 'AVAILABLE';
  const userId = req.userId as string;
  try {
    const {
      experience,
      education,
      specialization,
      description,
      email,
      website,
      instagram,
      phone,
      linkedin,
      officeAddress,
      facebook,
    } = req.body;
    const data = {
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
    const lawyerContact = new PrismaLawyerContact();
    const contact: Omit<LawyerContact, 'id'> = {
      lawyerId: profile.id,
      email,
      website,
      instagram,
      phone,
      officeAddress,
      facebook,
      linkedin,
    };
    await lawyerContact.createLawyerContact(contact, profile.id);

    res.status(201).json({ profile });
  } catch (error) {
    console.error('Error creating lawyer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLawyerProfile = async (req: RequestWithUser, res: Response) => {
  const userId = req.userId as string;
  if (!userId) {
    return res.status(400).json({ error: 'unauthorized' });
  }
  try {
    try {
      const profile = await lawyerProfile.getLawyerProfileById(userId);
      res.status(200).json({ profile });
    } catch (error: any) {
      console.error('Error fetching lawyer profile:', error);
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    console.error('Error fetching lawyer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
