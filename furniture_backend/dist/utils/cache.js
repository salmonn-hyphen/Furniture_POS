"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrSetCache = void 0;
const redisClient_1 = require("../config/redisClient");
const getOrSetCache = async (key, cb) => {
    try {
        const cacheData = await redisClient_1.redis.get(key);
        if (cacheData) {
            console.log("Cache Hit!");
            return JSON.parse(cacheData);
        }
        console.log("Cache Miss!");
        const freshData = await cb();
        await redisClient_1.redis.setex(key, 3600, JSON.stringify(freshData));
        return freshData;
    }
    catch (error) {
        console.log("Redis error:", error);
        throw error;
    }
};
exports.getOrSetCache = getOrSetCache;
//# sourceMappingURL=cache.js.map