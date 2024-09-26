"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// Location Schema
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
        required: false,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: locationSchema,
        required: false,
    },
    work: {
        type: String,
        required: false,
    },
    age: {
        type: Number, // Make it optional in the schema
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
        required: false,
    },
    userImage: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
