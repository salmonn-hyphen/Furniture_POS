import { Queue } from "bullmq";
import { Redis } from "ioredis";
import "dotenv/config";

const connection = new Redis({
  host: process.env.REDIS_HOST!,
  port: 6379,
  maxRetriesPerRequest: null,
});

const imageQueue = new Queue("imageQueue", { connection });

export default imageQueue;
