import { model, Model, Schema } from "mongoose";
import { IUser, ICountry } from "./user.interface";

export type UserModel = Model<IUser>;

// Location Schema
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
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: false,
  },
  work: {
    type: String,
    required: false,
  },
  age: {
    type: Number, // Make it optional in the schema
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: false,
  },
  userImage: {
    type: Schema.Types.Mixed,
    required: false,
  },
});

export const User: UserModel = model<IUser, UserModel>("User", userSchema);
