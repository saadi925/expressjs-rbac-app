import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createUser, findUserByEmail } from '../../prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken';

export const signupHandler = async (req: Request, res: Response) => {
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

  const token = generateToken(user);
  return res.status(201).json({ token });
};

export const signinHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await findUserByEmail(email);
    console.log(user);

    if (!user) {
      // if user is not found .
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    if (!user.verified)
      //  if user is not verified .
      return res.status(401).json({
        errors: [{ msg: 'Sorry ! User is Not Verified, Please Verify first!' }],
      });
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      //  incase , if password is incorrect
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
export const emailVerification = (req: Request, res: Response) => {};
export const resendConfirmation = (req: Request, res: Response) => {};
