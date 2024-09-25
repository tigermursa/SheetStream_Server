export interface ICountry {
  countryName: string;
  city: string;
}

export interface IUser {
  userName: string;
  email: string;
  password: string;
  location?: ICountry;
  work?: string;
  age?: number;
  gender?: "male" | "female" | "others";
}
