import { Request, Response, NextFunction } from "express";
import { getSettingStatus } from "../services/settingService";
import { createError } from "../utils/error";
import { errorCode } from "../config/errorCode";

const whiteList = ["127.0.0.1"];
export const maintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip: any = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (whiteList.includes(ip)) {
    console.log(`${ip} is allowed `);
    next();
  } else {
    const isMaintenance = await getSettingStatus("maintenance");
    if (isMaintenance?.value === "true") {
      return next(
        createError(
          "The Server is currently under maintenance, Please try again later",
          503,
          errorCode.maintenance
        )
      );
    }
    next();
  }
};
