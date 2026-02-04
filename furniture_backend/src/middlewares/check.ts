import { Request, Response, NextFunction } from "express";

interface CustomReq extends Request {
  userId?: number;
}

export const check = (req: CustomReq, res: Response, next: NextFunction) => {
  req.userId = 4122;
  next();
};
