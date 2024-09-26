// user.interface.ts
export interface ICountry {
  countryName: string;
  city: string;
}

export interface IUser {
  userImage?: any; // Made userImage optional
  _id: string;
  userName: string; // Required
  email: string; // Required and unique
  password: string; // Required
  location?: ICountry; // Optional
  work?: string; // Optional
  age?: number; // Optional
  gender?: "male" | "female" | "others"; // Optional
}
