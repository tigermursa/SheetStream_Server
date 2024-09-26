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

// Optimized user schema with optional fields
export const userSchema = z.object({
  userName: z.string().min(1, "Username is required").optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
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
  location: countrySchema.optional(), // Make location optional
  work: z.string().min(1, "Work field is required").optional(), // Make work optional
  age: z.number().int().positive("Age must be a positive integer").optional(), // Make age optional
  gender: z
    .enum(["male", "female", "others"], {
      required_error: "Gender is required",
    })
    .optional(), // Make gender optional
  userImage: z.any().optional(), // Make userImage optional
});

// Function to validate user data
export const validateUser = (userData: unknown) => {
  return userSchema.safeParse(userData);
};
