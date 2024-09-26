"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.userSchema = exports.countrySchema = void 0;
const zod_1 = require("zod");
// Reusable regex patterns
const passwordUpperCase = /[A-Z]/;
const passwordNumber = /[0-9]/;
const passwordSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
// Location schema
exports.countrySchema = zod_1.z.object({
    countryName: zod_1.z.string().min(1, "Country name is required"),
    city: zod_1.z.string().min(1, "City is required"),
});
// Optimized user schema with optional fields
exports.userSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1, "Username is required").optional(),
    email: zod_1.z.string().email("Invalid email format").min(1, "Email is required"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(passwordUpperCase, "Password must contain at least one uppercase letter")
        .regex(passwordNumber, "Password must contain at least one number")
        .regex(passwordSpecialChar, "Password must contain at least one special character"),
    location: exports.countrySchema.optional(), // Make location optional
    work: zod_1.z.string().min(1, "Work field is required").optional(), // Make work optional
    age: zod_1.z.number().int().positive("Age must be a positive integer").optional(), // Make age optional
    gender: zod_1.z
        .enum(["male", "female", "others"], {
        required_error: "Gender is required",
    })
        .optional(), // Make gender optional
    userImage: zod_1.z.any().optional(), // Make userImage optional
});
// Function to validate user data
const validateUser = (userData) => {
    return exports.userSchema.safeParse(userData);
};
exports.validateUser = validateUser;
