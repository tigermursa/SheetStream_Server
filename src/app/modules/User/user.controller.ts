import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../Error/CustomError";
import { User } from "./user.model";

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // Respond with user data
    return res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      location: user.location,
      work: user.work,
      age: user.age,
      gender: user.gender,
      userImage: user.userImage,
    });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};
