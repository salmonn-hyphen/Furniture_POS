"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
require("dotenv/config");
exports.redisConnection = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
};
//# sourceMappingURL=redisConnection.js.map