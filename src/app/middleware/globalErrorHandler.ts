import { Request, Response, NextFunction } from "express";
import { CustomError } from "../Error/CustomError";


export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  // If error is an instance of CustomError, handle it
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      errorCode: err.errorCode,
    });
  }

  // Fallback for unexpected errors
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    errorCode: "INTERNAL_SERVER_ERROR",
  });
}
