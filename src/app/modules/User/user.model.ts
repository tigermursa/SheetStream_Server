import { model, Model, Schema } from "mongoose";
import { IUser, ICountry } from "./user.interface";

export type UserModel = Model<IUser>;

// (Location)
const locationSchema: Schema<ICountry> = new Schema({
  countryName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

// Define schema for IUser
const userSchema: Schema<IUser, UserModel> = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
  },
});

export const User: UserModel = model<IUser, UserModel>("User", userSchema);
