import { Request, Response, NextFunction } from "express";

interface CustomReq extends Request {
  userId?: number;
}

export const healthCheck = (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    message: "Hello World, the response is ready",
    userId: req.userId,
  });
};
