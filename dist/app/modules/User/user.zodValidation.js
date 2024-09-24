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
// Optimized user schema
exports.userSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1, "Username is required"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(passwordUpperCase, "Password must contain at least one uppercase letter")
        .regex(passwordNumber, "Password must contain at least one number")
        .regex(passwordSpecialChar, "Password must contain at least one special character"),
    location: exports.countrySchema,
    work: zod_1.z.string().min(1, "Work field is required"),
    age: zod_1.z.number().int().positive("Age must be a positive integer"),
    gender: zod_1.z.enum(["male", "female", "others"], {
        required_error: "Gender is required",
    }),
});
// Function to validate user data
const validateUser = (userData) => {
    return exports.userSchema.safeParse(userData);
};
exports.validateUser = validateUser;
