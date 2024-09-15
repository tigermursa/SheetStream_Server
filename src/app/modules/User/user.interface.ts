interface ICountry {
  countryName: string;
  city: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  location: ICountry;
  work: string;
  age: string;
  gender: "male" | "female" | "others";
}
