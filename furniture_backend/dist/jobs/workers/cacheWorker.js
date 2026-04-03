"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheWorker = void 0;
const bullmq_1 = require("bullmq");
const redisClient_1 = require("../../config/redisClient");
require("dotenv/config");
const redisConnection_1 = require("../../config/redisConnection");
exports.cacheWorker = new bullmq_1.Worker("cache-invalidation", async (job) => {
    const { pattern } = job.data;
    await invalidationCache(pattern);
}, {
    connection: redisConnection_1.redisConnection,
    concurrency: 5,
});
exports.cacheWorker.on("completed", (job) => {
    console.log(`Job completed with result ${job.id}`);
});
exports.cacheWorker.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed with ${err.message}`);
});
const invalidationCache = async (pattern) => {
    try {
        //Scan as stream with limit 100 count
        const stream = redisClient_1.redis.scanStream({
            match: pattern,
            count: 100,
        });
        const pipeline = redisClient_1.redis.pipeline();
        let totalKeys = 0;
        stream.on("data", (keys) => {
            if (keys.length > 0) {
                keys.forEach((key) => {
                    pipeline.del(key);
                    totalKeys++;
                });
            }
        });
        //Warp
        await new Promise((resolve, reject) => {
            stream.on("end", async () => {
                try {
                    if (totalKeys > 0) {
                        await pipeline.exec();
                        console.log(`Invalidated ${totalKeys} keys`);
                    }
                    resolve();
                }
                catch (execError) {
                    reject(execError);
                }
            });
            stream.on("error", (error) => {
                reject(error);
            });
        });
    }
    catch (error) {
        console.log("Cache Invalidation Error:", error);
        throw error;
    }
};
//# sourceMappingURL=cacheWorker.js.map