export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // name of this error is the same as the class name
    this.name = this.constructor.name;

    //  the stack trace if not in production
    if (process.env.NODE_ENV !== "production") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

//this is using in auth.login
//this is using in auth.signup
