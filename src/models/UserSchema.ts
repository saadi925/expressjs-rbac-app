import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'lawyer' | 'client';
}

// Extend `Document` with `IUser`
export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['lawyer', 'client'] }
});

// UserSchema.pre<IUserDocument>('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

export default mongoose.model<IUserDocument>('User', UserSchema);
