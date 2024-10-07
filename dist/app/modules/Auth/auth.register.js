"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_services_1 = require("./auth.services");
const user_zodValidation_1 = require("../User/user.zodValidation");
const CustomError_1 = require("../../Error/CustomError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//Imports Ends _____________________________________________________________
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userName, email, password, gender, location, age, work } = req.body;
        try {
            // Validate input using Zod
            const validationResult = (0, user_zodValidation_1.validateUser)(req.body);
            if (!validationResult.success) {
                // Return validation errors if input is invalid
                return res.status(400).json({ errors: validationResult.error.errors });
            }
            // Check if user already exists
            const validUser = yield auth_services_1.AuthService.findUserByEmail(email);
            if (validUser) {
                throw new CustomError_1.CustomError("User already exists", 400);
            }
            // Hash the password
            const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
            // Create user data
            const userData = {
                userName,
                email,
                password: hashedPassword,
                gender,
                location,
                age,
                work,
            };
            // Save the user
            const newUser = yield auth_services_1.AuthService.createUser(userData);
            // Generate JWT token ....
            const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });
            // Set HTTP-only, Secure, and SameSite cookie
            res
                .cookie("access_token", token, {
                httpOnly: true,
                secure: false, // Set 'secure' to true in production
                sameSite: "none", // Adjust sameSite for production
                maxAge: 1000 * 60 * 60 * 24,
            })
                .status(201)
                .json({
                message: "User registered successfully!",
                _id: newUser._id,
                username: newUser.userName,
                email: newUser.email,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
