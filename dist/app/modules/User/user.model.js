"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// (Location)
const locationSchema = new mongoose_1.Schema({
    countryName: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
});
// Define schema for IUser
const userSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: locationSchema,
        required: true,
    },
    work: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
        required: true,
    },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
