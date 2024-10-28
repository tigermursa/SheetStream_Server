"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    port: process.env.PORT,
    dbUrl: process.env.DATABASE_URL,
    bcrypt_salt: process.env.BCRYPT_SALT_ROUNDS,
    dev_frontend: process.env.DEV_FRONTEND_URL,
    prod_frontend: process.env.PROD_FRONTEND_UR,
};
