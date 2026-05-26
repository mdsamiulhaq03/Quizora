import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  password?: string;
  isGuest: boolean;
  streak: number;
  lastStudiedAt?: Date;
  streakFreezeUsed: boolean;
  onboardingComplete: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: String,
    password: { type: String, select: false },
    isGuest: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    lastStudiedAt: Date,
    streakFreezeUsed: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
