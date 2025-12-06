import { Request, Response, NextFunction } from "express";

interface CustomReq extends Request {
  userId?: number;
  user?: any;
}

export const getAllUsers = (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  const id = req.userId;
  const user = req.user;
  res
    .status(200)
    .json({ message: req.t("welcome"), userId: id, currentRole: user.role });
};
