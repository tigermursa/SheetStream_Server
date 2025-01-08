"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv")); // Load environment variables
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan")); // Import Morgan
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file_routes_1 = require("./app/modules/File/file.routes");
const auth_routes_1 = require("./app/modules/Auth/auth.routes");
const user_routes_1 = require("./app/modules/User/user.routes");
const config_1 = __importDefault(require("./app/config"));
// Load .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: config_1.default.dev_frontend,
    credentials: true,
}));
// Morgan Middleware (for console logging)
app.use((0, morgan_1.default)("dev"));
// Optionally log requests to a file
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, "access.log"), { flags: "a" });
app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
// Routes
app.use("/api/v1/files", file_routes_1.FileRoutes);
app.use("/api/v2/auth", auth_routes_1.AuthRoutes);
app.use("/api/v3/user", user_routes_1.UserRoutes);
// Simple health check route
app.get("/", (req, res) => {
    res.send("The Server is Running");
});
exports.default = app;
//env updated
