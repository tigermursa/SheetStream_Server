import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../../Error/CustomError";
import { User } from "./user.model";

// Controller to get user information based on the JWT token
export const getUserByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Get token from cookies
    const token = req.cookies.access_token;

    if (!token) {
      throw new CustomError("Authentication token missing", 401);
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    // Fetch the user by the decoded user ID
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // Respond with user data
    return res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

// location: user.location,
// work: user.work,
// age: user.age,
// gender: user.gender,
// userImage: user.userImage,
