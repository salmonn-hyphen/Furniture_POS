import { Queue } from "bullmq";
import "dotenv/config";
import { redisConnection } from "../../config/redisConnection";
// const defaultJobOptions: any = {
//   attempt: 3,
//   backoff: {
//     type: "exponential",
//     delay: 1000,
//   },
//   removeOnComplete: true,
//   removeOnFail: 1000,
// };

export const cacheQueue = new Queue("cache-invalidation", {
  connection: redisConnection,
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
