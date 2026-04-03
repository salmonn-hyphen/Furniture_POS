"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMemory = void 0;
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const fileStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images");
        // const type = file.mimetype.split("/")[0];
        // if (type === "image") {
        //   cb(null, "uploads/images");
        // } else {
        //   cb(null, "uploads/files");
        // }
    },
    filename: function (req, file, cb) {
        const extension = node_path_1.default.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + extension;
        console.log(extension);
        cb(null, uniqueSuffix);
    },
});
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpeg", "image/jpeg"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage: fileStorage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 },
});
exports.uploadMemory = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 }, // Maximum file size is 10MB, so image optimization is needed.
});
exports.default = upload;
//# sourceMappingURL=uploadFile.js.map