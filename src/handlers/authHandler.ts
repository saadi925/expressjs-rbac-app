import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../controllers/authController';
import { validationResult } from 'express-validator';
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
 const credentials = {name,email,password,role}
  user = await createUser(credentials);

  const token = generateToken(user)
  res.json({ token });
};


import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken';

export const signinHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
