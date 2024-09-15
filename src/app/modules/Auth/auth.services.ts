import { Model } from "mongoose";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";

export interface UserWithStatic extends Model<IUser> {
  isUserExists(id: string): Promise<IUser | null>;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return await User.findOne({ email });
}

export async function createUser(userData: Partial<IUser>): Promise<IUser> {
  const newUser = new User(userData);
  return await newUser.save();
}

export const AuthService = {
  findUserByEmail,
  createUser,
};
