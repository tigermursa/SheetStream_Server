export class CustomError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(
    message: string,
    statusCode: number,
    errorCode = "UNKNOWN_ERROR"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    // Capture stack trace (optional for cleaner logs)
    Error.captureStackTrace(this, this.constructor);
  }
}
