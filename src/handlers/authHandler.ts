import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  PrismaDBProfile,
  createUser,
  findUserByEmail,
  prisma,
} from '../../prisma';
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
      if (!user.verified) {
        res.status(401).json({
          errors: [{ msg: 'verify your email to get logged in' }],
          redirectToVerify: true,
        });
        return;
      } else {
        return res.status(400).json({
          errors: [{ msg: 'User already exists' }],
          redirectToLogin: true,
        });
      }
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
    const newUser = await createUser(data);
    const emailVerification = new EmailVerification();
    const code = await emailVerification.genRandomCode();
    const verificationToken = generateVerificationToken(newUser, code);
    await emailVerification.createEmailVerification({
      email,
      verificationToken,
      code,
      userId: newUser.id,
    });
    await sendVerificationEmail(email, verificationToken, code);
    res.status(201).json({
      message:
        'user has been registered successfully , verify email to get logged in',
      redirectToVerify: true,
    });
  } catch (error) {
    console.error('Error in signupHandler:', error);
    return res.status(500).json({
      errors: [
        {
          msg: 'Internal Server Error',
        },
      ],
    });
  }
};

export const signinHandler = async (req: Request, res: Response) => {
  try {
    let success = false;
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success });
    }
    const user = await findUserByEmail(email);

    if (!user) {
      // if user is not found .
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Credentials' }], success });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      //  incase , if password is incorrect
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Credentials' }], success });
    }
    if (!user.verified) {
      return res.status(401).json({
        errors: [{ msg: 'Sorry ! User is Not Verified, Please Verify first!' }],
        success,
        email,
      });
    }
    success = true;
    const token = generateToken(user);
    const profileDB = new PrismaDBProfile();
    const profile = await profileDB.getProfileWithRole(user.id);
    if (!profile) {
      res.status(201).json({
        token,
        success,
        errors: [
          {
            msg: 'create your profile to get started',
          },
        ],
        redirectToProfile: true,
      });
    } else {
      res.status(201).json({ token, success });
    }
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
export const verifyWithCode = async (req: Request, res: Response) => {
  const email = req.query.email;
  const code = req.query.code;
  if (
    !email ||
    !code ||
    typeof email !== 'string' ||
    typeof code !== 'string'
  ) {
    res.status(403).json({ error: 'email or code is missing' });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    res.status(403).json({ error: 'user not found ' });
    return;
  }
  if (user.verified) {
    res.status(403).json({ error: 'email already verified, you can login' });
  }
  const emailVerify = new EmailVerification();
  const emailRecord = await emailVerify.getEmailVerifyById(user.id);
  if (!emailRecord) {
    res.status(403).json({
      error: 'no email exists',
    });
    return;
  }
  if (emailRecord.email !== email) {
    res.status(403).json({ error: 'invalid email' });
  }
  const verify = verifyCodeForEmailVerify(emailRecord, Number(code));
  if (!verify) {
    res.status(403).json({ error: 'invalid code' });
  } else {
    const token = generateVerificationToken(user, Number(code));
    //  user verified .
    const role = user.role;
    res.status(200).json({ token, role, redirectToProfile: true });
  }
};
const verifyCodeForEmailVerify = (
  emailRecord: {
    id: bigint;
    email: string;
    verificationToken: string;
    code: number;
    userId: string;
  },
  code: number,
) => {
  if (emailRecord.code !== code) {
    return false;
  } else {
    return true;
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
