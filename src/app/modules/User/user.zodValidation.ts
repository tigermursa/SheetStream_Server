import { z } from "zod";

// Reusable regex patterns
const passwordUpperCase = /[A-Z]/;
const passwordNumber = /[0-9]/;
const passwordSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

// Location schema
export const countrySchema = z.object({
  countryName: z.string().min(1, "Country name is required"),
  city: z.string().min(1, "City is required"),
});

// Optimized user schema
export const userSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      passwordUpperCase,
      "Password must contain at least one uppercase letter"
    )
    .regex(passwordNumber, "Password must contain at least one number")
    .regex(
      passwordSpecialChar,
      "Password must contain at least one special character"
    ),
  location: countrySchema,
  work: z.string().min(1, "Work field is required"),
  age: z.number().int().positive("Age must be a positive integer"),
  gender: z.enum(["male", "female", "others"], {
    required_error: "Gender is required",
  }),
});

// Function to validate user data
export const validateUser = (userData: unknown) => {
  return userSchema.safeParse(userData);
};
