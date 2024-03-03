import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createUser, findUserByEmail } from '../../prisma';
import bcrypt from 'bcrypt';
import {
  generateToken,
  generateVerificationToken,
} from '../utils/generateToken';
import jwt from 'jsonwebtoken';
import { KEYS } from '../../config/keys';
import { sendVerificationEmail } from './sendVerificationEmail';
import { EmailVerification } from '../../prisma/queries/EmailVerification';
import { AccountNotifications } from '../../notifications/AccountNotifications';
export const signupHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await findUserByEmail(email);

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const data = {
      name,
      email,
      password,
      role,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      verified: false,
    };
    user = await createUser(data);
    const emailVerification = new EmailVerification();
    const code = await emailVerification.genRandomCode();
    const verificationToken = generateVerificationToken(user, code);
    const token = generateVerificationToken(user, code);
    await emailVerification.createEmailVerification({
      email,
      verificationToken,
      code,
      userId: user.id,
    });
    await sendVerificationEmail(email, verificationToken, code);

    return res.status(201).json({ token });
  } catch (error) {
    console.error('Error in signupHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const signinHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await findUserByEmail(email);

    if (!user) {
      // if user is not found .
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      //  incase , if password is incorrect
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    if (!user.verified) {
      return res.status(401).json({
        errors: [{ msg: 'Sorry ! User is Not Verified, Please Verify first!' }],
        success: true,
        email,
      });
    }
    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

export const resendConfirmation = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is already verified
    if (user.verified) {
      return res.status(400).json({ error: 'User is already verified' });
    }
    const emailVerification = new EmailVerification();
    // Generate a new verification code
    const code = await emailVerification.genRandomCode();
    const verificationToken = generateVerificationToken(user, code);
    // Create a new email verification record or update the existing one
    await emailVerification.createOrUpdateEmailVerification({
      email,
      userId: user.id,
      code,
      verificationToken,
    });
    await sendVerificationEmail(email, verificationToken, code);

    return res
      .status(200)
      .json({ message: `Confirmation email sent successfully to ${email}` });
  } catch (error) {
    console.error('Error resending confirmation email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const emailVerificationHandler = async (req: Request, res: Response) => {
  try {
    const one_time_token = req.query.one_time_token;
    if (!one_time_token || typeof one_time_token !== 'string') {
      return res.status(400).json({ error: 'Missing verification token' });
    }

    const decodedToken: any = jwt.verify(
      one_time_token as string,
      KEYS.JWT_SECRET,
    );
    const { id, code } = decodedToken;

    // Validate if the decoded token contains the necessary information
    if (!id || !code) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // Check if the verification code matches the one stored in the database
    const emailVerification = new EmailVerification();
    const email = await emailVerification.getEmailVerifyById(id);
    if (!email) {
      return res
        .status(404)
        .json({ error: 'Email verification record not found' });
    }
    if (email.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update the user's verified status in the database
    await emailVerification.updateUserVerifyStatus(email.userId, true);

    const notifier = new AccountNotifications();
    await notifier.emailVerifyNotification(email.email, email.userId);
    // Delete the email verification record from the database
    await emailVerification.deleteEmailVerification(email.email, id);
    return res.status(200).json({ message: 'Email verification successful' });
  } catch (error) {
    console.error('Error in emailVerificationHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
