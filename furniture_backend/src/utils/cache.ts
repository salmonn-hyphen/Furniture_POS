import { redis } from "../config/redisClient";

export const getOrSetCache = async (key: any, cb: any) => {
  try {
    const cacheData = await redis.get(key);
    if (cacheData) {
      console.log("Cache Hit!");
      return JSON.parse(cacheData);
    }
    console.log("Cache Miss!");
    const freshData = await cb();
    await redis.setex(key, 3600, JSON.stringify(freshData));
    return freshData;
  } catch (error) {
    console.log("Redis error:", error);
    throw error;
  }
};
