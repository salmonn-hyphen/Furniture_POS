import { Request, Response, NextFunction } from "express";

interface CustomReq extends Request {
  userId?: number;
}

export const auth = (req: CustomReq, res: Response, next: NextFunction) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    const error: any = "You are not an authenticated user!";
    error.status = 401;
    error.code = "Error_Unauthenticated";
    return next(error);
  }
  if (!accessToken) {
    const error: any = "Your access token has expired!";
    error.status = 401;
    error.code = "Error_Expired";
    return next(error);
  }
  next();
};
