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
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_services_1 = require("./auth.services");
const CustomError_1 = require("../../Error/CustomError");
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Find user by email
            const validUser = yield auth_services_1.AuthService.findUserByEmail(email);
            if (!validUser) {
                throw new CustomError_1.CustomError("User not found", 404);
            }
            // Check if the password matches
            const validPassword = bcryptjs_1.default.compareSync(password, validUser.password);
            if (!validPassword) {
                throw new CustomError_1.CustomError("Wrong credentials", 401);
            }
            // Generate JWT token with expiration
            const token = jsonwebtoken_1.default.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN } // Token expires in  2d
            );
            // Set HTTP-only, Secure,
            res
                .cookie("access_token", token, {
                httpOnly: true,
                secure: true, // Set 'secure' to true in production
                sameSite: "none",
                maxAge: 1000 * 60 * 60 * 24,
            })
                .status(200)
                .json({
                message: "User logged in successfully!",
                _id: validUser._id,
                username: validUser.userName,
                email: validUser.email,
                userImage: validUser.userImage,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
