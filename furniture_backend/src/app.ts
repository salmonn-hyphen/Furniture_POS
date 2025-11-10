import express, { NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { limiter } from "./middlewares/rateLimiter";
import healthRoute from "./routes/v1/checkRoute";
import { Request, Response } from "express";
import authRoutes from "./routes/v1/authRoutes";

export const app = express();

app
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors())
  .use(helmet())
  .use(compression())
  .use(limiter);

app.use("/api/v1", healthRoute);
app.use("/api/v1/", authRoutes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const errorCode = error.code || "Error Code";
  const message = error.message || "Server Error";
  res.status(status).json({ message, error: errorCode });
});
