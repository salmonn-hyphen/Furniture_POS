"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
require("dotenv/config");
exports.redis = new ioredis_1.Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
});
//# sourceMappingURL=redisClient.js.map