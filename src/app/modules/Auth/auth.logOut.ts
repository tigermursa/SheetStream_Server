import { Request, Response, NextFunction } from "express";

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({
      message: "User has been logged out successfully!",
    });
  } catch (error) {
    next(error);
  }
}
