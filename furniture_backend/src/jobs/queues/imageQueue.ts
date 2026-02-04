import { Queue } from "bullmq";
import "dotenv/config";
import { redisConnection } from "../../config/redisConnection";

const imageQueue = new Queue("imageQueue", {
  connection: redisConnection,
});

export default imageQueue;
