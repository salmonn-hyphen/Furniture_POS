import { Worker } from "bullmq";
import { redis } from "../../config/redisClient";
import "dotenv/config";
import { redisConnection } from "../../config/redisConnection";
export const cacheWorker = new Worker(
  "cache-invalidation",
  async (job) => {
    const { pattern } = job.data;
    await invalidationCache(pattern);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

cacheWorker.on("completed", (job) => {
  console.log(`Job completed with result ${job.id}`);
});

cacheWorker.on("failed", (job: any, err) => {
  console.log(`Job ${job.id} failed with ${err.message}`);
});

const invalidationCache = async (pattern: string) => {
  try {
    //Scan as stream with limit 100 count
    const stream = redis.scanStream({
      match: pattern,
      count: 100,
    });

    const pipeline = redis.pipeline();
    let totalKeys = 0;

    stream.on("data", (keys: string[]) => {
      if (keys.length > 0) {
        keys.forEach((key) => {
          pipeline.del(key);
          totalKeys++;
        });
      }
    });

    //Warp
    await new Promise<void>((resolve, reject) => {
      stream.on("end", async () => {
        try {
          if (totalKeys > 0) {
            await pipeline.exec();
            console.log(`Invalidated ${totalKeys} keys`);
          }
          resolve();
        } catch (execError) {
          reject(execError);
        }
      });
      stream.on("error", (error: any) => {
        reject(error);
      });
    });
  } catch (error) {
    console.log("Cache Invalidation Error:", error);
    throw error;
  }
};
