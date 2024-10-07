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
exports.getUserByToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CustomError_1 = require("../../Error/CustomError");
const user_model_1 = require("./user.model");
// Controller to get user information based on the JWT token
const getUserByToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get token from cookies
        const token = req.cookies.access_token;
        if (!token) {
            throw new CustomError_1.CustomError("Authentication token missing", 401);
        }
        // Verify the token and extract the user ID
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Fetch the user by the decoded user ID
        const user = yield user_model_1.User.findById(decoded.id);
        if (!user) {
            throw new CustomError_1.CustomError("User not found", 404);
        }
        // Respond with user data
        return res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
        });
    }
    catch (error) {
        next(error); // Pass error to error-handling middleware
    }
});
exports.getUserByToken = getUserByToken;
// location: user.location,
// work: user.work,
// age: user.age,
// gender: user.gender,
// userImage: user.userImage,
