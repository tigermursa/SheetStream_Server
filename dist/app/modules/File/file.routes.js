"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const file_controller_1 = require("./file.controller");
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = express_1.default.Router();
router.post("/upload", upload.single("file"), file_controller_1.uploadFile);
router.get("/files", file_controller_1.getAllFilesController);
router.get("/single/:id", file_controller_1.getFileController);
router.delete("/delete/:id", file_controller_1.deleteFileController);
router.patch("/update/:id", file_controller_1.updateFileController);
router.patch("/toggle/isOnline/:id", file_controller_1.toggleFileStatusController);
router.get("/search", file_controller_1.searchFilesController);
exports.FileRoutes = router;
