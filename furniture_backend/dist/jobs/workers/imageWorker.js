"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("node:fs/promises");
require("dotenv/config");
const redisConnection_1 = require("../../config/redisConnection");
//create a worker for image optimization queue
const imageWorker = new bullmq_1.Worker("imageQueue", async (job) => {
    const { filePath, fileName, width, height, quality } = job.data;
    const optimizeDir = path_1.default.join(process.cwd(), "uploads", "optimize");
    await (0, promises_1.mkdir)(optimizeDir, { recursive: true });
    const optimizedImagePath = path_1.default.join(optimizeDir, fileName);
    await (0, sharp_1.default)(filePath)
        .resize(width, height)
        .webp({ quality: quality })
        .toFile(optimizedImagePath);
}, {
    connection: redisConnection_1.redisConnection,
});
imageWorker.on("completed", (job) => {
    console.log(`Job is completed in ${job.id}`);
});
imageWorker.on("failed", (job, err) => {
    console.log(`Image job failed (${job?.id}): ${err.message}`);
});
//# sourceMappingURL=imageWorker.js.map