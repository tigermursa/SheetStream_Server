import { Model, Schema } from "mongoose";
import { IUser } from "./user.interface";

export type UserModel = Model<IUser>;

const userSchema: Schema = new Schema<IUser, UserModel>({

    name: {
        
    }
    email: string;
    password: string;
    location: ICountry;
    work: string;
    age: string;
    gender: "male" | "female" | "others";
});
