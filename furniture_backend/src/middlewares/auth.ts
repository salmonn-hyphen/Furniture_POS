import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { getUserById, updateUser } from "../services/authService";
import { createError } from "../utils/error";
import { errorCode } from "../config/errorCode";

interface CustomReq extends Request {
  userId?: number;
}

export const auth = (req: CustomReq, res: Response, next: NextFunction) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  const generateNewToken = async () => {
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        id: number;
        phone: string;
      };
    } catch (error: any) {
      return next(
        createError(
          "You are not an authenticated user!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const user = await getUserById(decoded.id);
    if (!user) {
      return next(
        createError(
          "This account has not registered!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user.phone !== decoded.phone) {
      return next(
        createError(
          "This account has not registered!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user.randToken !== refreshToken) {
      return next(
        createError(
          "This account has not registered!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const accessPayload = { id: user!.id };
    const refreshPayload = { id: user!.id, phone: user!.phone };

    const newAccessToken = jwt.sign(
      accessPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15, //15 minutes
      }
    );
    const newRefreshToken = jwt.sign(
      refreshPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30days",
      }
    );
    const userData = {
      randToken: newRefreshToken,
    };
    await updateUser(user!.id, userData);
    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });
    req.userId = decoded.id;
    next();
  };
  if (!refreshToken) {
    return next(
      createError(
        "You are not an authenticated user!",
        401,
        errorCode.unauthenticated
      )
    );
  }
  if (!accessToken) {
    generateNewToken();
  } else {
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        id: number;
      };
      req.userId = decoded.id;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        const error: any = new Error("Access token has been expired!");
        error.status = 401;
        error.code = "Error_Expired";
      } else {
        return next(
          createError("Access Token is invalid.", 400, errorCode.attack)
        );
      }
    }
  }
};
