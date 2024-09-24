"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
const CustomError_1 = require("../Error/CustomError");
function globalErrorHandler(err, req, res, next) {
    // If error is an instance of CustomError, handle it
    if (err instanceof CustomError_1.CustomError) {
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
