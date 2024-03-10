import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { LawyerContact } from '../../prisma/queries/LawyerContact';
import { RequestWithUser } from 'types/profile';
type ContactRecord = {
  email: string | null;
  phoneNumber: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
  phone: string | null;
  officeAddress: string | null;
};
const lawyerContact = new LawyerContact();
export const createLawyerContact = async (
  req: RequestWithUser,
  res: Response,
) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.userId as string;
  const {
    email,
    phone,
    phoneNumber,
    facebook,
    officeAddress,
    instagram,
    linkedin,
  } = req.body as ContactRecord;

  try {
    const data = {
      email,
      phone,
      phoneNumber,
      facebook,
      officeAddress,
      instagram,
      linkedin,
      lawyerId: userId,
    };
    const profile = await lawyerContact.createLawyerContact(data);
    res.status(201).json({ profile });
  } catch (error) {
    console.error('Error creating lawyer contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getLawyerContactById = async (
  req: RequestWithUser,
  res: Response,
) => {
  const { id } = req.params;

  try {
    const profile = await lawyerContact.getLawyerContactById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Lawyer contact not found' });
    }
    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching lawyer contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateLawyerContact = async (
  req: RequestWithUser,
  res: Response,
) => {
  const userId = req.userId as string;
  const {
    email,
    phone,
    phoneNumber,
    facebook,
    officeAddress,
    instagram,
    linkedin,
  } = req.body as ContactRecord;
  try {
    const data = {
      email,
      phone,
      phoneNumber,
      facebook,
      officeAddress,
      instagram,
      linkedin,
    };
    const profile = await lawyerContact.updateLawyerContact(userId, data);
    if (!profile) {
      return res.status(404).json({ error: 'Lawyer contact not found' });
    }
    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error updating lawyer contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteLawyerContact = async (
  req: RequestWithUser,
  res: Response,
) => {
  const userId = req.userId as string;

  try {
    const profile = await lawyerContact.deleteLawyerContact(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Lawyer contact not found' });
    }
    res.status(200).json({ message: 'Lawyer contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting lawyer contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
