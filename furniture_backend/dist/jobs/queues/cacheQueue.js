"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheQueue = void 0;
const bullmq_1 = require("bullmq");
require("dotenv/config");
const redisConnection_1 = require("../../config/redisConnection");
// const defaultJobOptions: any = {
//   attempt: 3,
//   backoff: {
//     type: "exponential",
//     delay: 1000,
//   },
//   removeOnComplete: true,
//   removeOnFail: 1000,
// };
exports.cacheQueue = new bullmq_1.Queue("cache-invalidation", {
    connection: redisConnection_1.redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: 1000,
    },
});
//# sourceMappingURL=cacheQueue.js.map