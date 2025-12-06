import { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/authService";
import { errorCode } from "../config/errorCode";

interface CustomReq extends Request {
  userId?: number;
  user?: any;
}

export const authorize = (permission: boolean, ...roles: string[]) => {
  return async (req: CustomReq, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await getUserById(userId!);

    if (!user) {
      const error: any = new Error();
      error.status = 401;
      error.code = errorCode.unauthenticated;
      return next(error);
    }
    const result = roles.includes(user.role);

    if (permission && !result) {
      const error: any = new Error();
      error.status = 403;
      error.code = errorCode.unauthorized;
      return next(error);
    }

    if (!permission && result) {
      const error: any = new Error();
      error.status = 403;
      error.code = errorCode.unauthorized;
      return next(error);
    }
    req.user = user;
    next();
  };
};
