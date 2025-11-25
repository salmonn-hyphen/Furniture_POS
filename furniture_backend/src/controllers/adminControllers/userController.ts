import { Request, Response, NextFunction } from "express";

interface CustomReq extends Request {
  userId?: number;
}

export const getAllUsers = (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  const id = req.userId;
  res.status(200).json({ message: req.t("welcome"), userId: id });
};
