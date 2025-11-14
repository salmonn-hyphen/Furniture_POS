import { Request, Response, NextFunction } from "express";

interface CustomReq extends Request {
  userId?: number;
}

export const getAllUsers = (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json("user controller");
};
