"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the 'dotenv' library which loads environment variables from a .env file into process.env
const dotenv_1 = __importDefault(require("dotenv"));
// Import the 'path' library which helps with handling and transforming file paths
const path_1 = __importDefault(require("path"));
// Load the environment variables from the .env file located in the current working directory
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
// Export an object with the necessary configuration settings for the application
exports.default = {
    port: process.env.PORT, // The port number on which the server will run, taken from the environment variables
    dbUrl: process.env.DATABASE_URL, // The database URL, taken from the environment variables
    bcrypt_salt: process.env.BCRYPT_SALT_ROUNDS, // The number of salt rounds for bcrypt (used for hashing passwords), taken from the environment variables
};
