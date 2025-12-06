import express, { NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { limiter } from "./middlewares/rateLimiter";
import { auth } from "./middlewares/auth";
import healthRoute from "./routes/v1/checkRoute";
import { Request, Response } from "express";
import authRoute from "./routes/v1/authRoutes";
import userRoute from "./routes/v1/admin/userRoutes";
import profileRoute from "./routes/v1/api/user";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
import { authorize } from "./middlewares/authorize";
export const app = express();

var whitelist = ["http://example1.com", "http://localhost:5173"];

var corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void
  ) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors())
  .use(cookieParser())
  .use(helmet())
  .use(compression())
  .use(limiter);

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(
        process.cwd(),
        "src/locals",
        "{{lng}}",
        "{{ns}}.json"
      ),
    },
    detection: {
      order: ["querystring", "cookie"],
      caches: ["cookies"],
    },
    fallbackLng: "en",
    preload: ["en", "mm"],
  });
app.use(middleware.handle(i18next));

app.use("/api/v1", healthRoute);
app.use("/api/v1/", authRoute);
app.use("/api/v1/", auth, authorize(true, "AUTHOR"), userRoute);
app.use("/api/v1/", profileRoute);
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const errorCode = error.code || "Error Code";
  const message = error.message || "Server Error";
  res.status(status).json({ message, error: errorCode });
});
