import User from '../models/UserSchema';
import bcrypt from 'bcrypt';

type userCredentials = {
    name: string;
    email: string;
    password: string;
    role :"lawyer" | "client"
    };
export const createUser = async (credentials :userCredentials ) => {
    const { name, email, role } = credentials;
    const salt = await bcrypt.genSalt(10);
    const secretPassword = await bcrypt.hash(credentials.password, salt);

  const user = new User({
    name,
    email,
    password: secretPassword,
    role,
  });
  await user.save();
  return user;
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};
