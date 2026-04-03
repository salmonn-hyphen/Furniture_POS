"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
require("dotenv/config");
const redisConnection_1 = require("../../config/redisConnection");
const imageQueue = new bullmq_1.Queue("imageQueue", {
    connection: redisConnection_1.redisConnection,
});
exports.default = imageQueue;
//# sourceMappingURL=imageQueue.js.map