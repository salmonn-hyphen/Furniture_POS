import { Worker } from "bullmq";
import sharp from "sharp";
import path from "path";
import "dotenv/config";
import { redisConnection } from "../../config/redisConnection";
//create a worker for image optimization queue
const imageWorker = new Worker(
  "imageQueue",
  async (job) => {
    const { filePath, fileName, width, height, quality } = job.data;
    const optimizedImagePath = path.join(
      __dirname,
      "../../..",
      "/uploads/optimize",
      fileName,
    );
    await sharp(filePath)
      .resize(width, height)
      .webp({ quality: quality })
      .toFile(optimizedImagePath);
  },
  {
    connection: redisConnection,
  },
);

imageWorker.on("completed", (job) => {
  console.log(`Job is completed in ${job.id}`);
});
