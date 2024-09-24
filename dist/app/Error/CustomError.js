"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode, errorCode = "UNKNOWN_ERROR") {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        // Capture stack trace (optional for cleaner logs)
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
