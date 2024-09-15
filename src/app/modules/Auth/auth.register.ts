//Imports starts __________________________________________________________
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.services";
import { validateUser } from "../User/user.zodValidation";
import { CustomError } from "../../Error/CustomError";
import { IUser } from "../User/user.interface";
import bcryptjs from "bcryptjs";
//Imports Ends _____________________________________________________________

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const {
    userName,
    email,
    password,
    confirmPassword,
    gender,
    location,
    age,
    work,
  } = req.body;

  try {
    // Validate input using Zod
    const validationResult = validateUser(req.body);
    if (!validationResult.success) {
      // Return validation errors if input is invalid
      return res.status(400).json({ errors: validationResult.error.errors });
    }

    // Check if user already exists
    const validUser = await AuthService.findUserByEmail(email);
    if (validUser) {
      throw new CustomError("User already exists", 400);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new CustomError("Passwords don't match", 400);
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create user data
    const userData: Partial<IUser> = {
      userName,
      email,
      password: hashedPassword,
      gender,
      location,
      age,
      work,
    };

    // Save the user
    const newUser = await AuthService.createUser(userData);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.EXPIRES_IN }
    );

    // Set HTTP-only, Secure, and SameSite cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true, // Set 'secure' to true in production
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
  } catch (error) {
    next(error);
  }
}
