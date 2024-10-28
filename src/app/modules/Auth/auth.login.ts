// /src/services/auth/login.ts (backend)
import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.services";
import { CustomError } from "../../Error/CustomError";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { email, password } = req.body;

    // Find user by email
    const validUser = await AuthService.findUserByEmail(email);
    if (!validUser) {
      throw new CustomError("User not found", 404);
    }

    // Check if the password matches
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      throw new CustomError("Wrong credentials", 401);
    }

    // Generate JWT token with expiration
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.EXPIRES_IN } // Token expires in 2d
    );

    // Return the token (do not set the cookie here)
    res.status(200).json({
      message: "User logged in successfully!",
      token,
      _id: validUser._id,
      username: validUser.userName,
      email: validUser.email,
      userImage: validUser.userImage,
    });
  } catch (error) {
    next(error);
  }
}
