import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { getUserById, updateUser } from "../services/authService";
import { checkUserIfNotExist } from "../utils/auth";
import * as bcrypt from "bcrypt";
import { createError } from "../utils/error";
import { errorCode } from "../config/errorCode";
import jwt from "jsonwebtoken";

interface CustomReq extends Request {
  userId?: number;
}
export const changePassword = [
  body("currentPassword", "Current Password is Wrong!")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
  body("newPassword", "New Password is Invalid")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
  body("reTypePassword", "Retype-Password is Invalid")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { currentPassword, newPassword, reTypePassword } = req.body;

    if (newPassword !== reTypePassword) {
      return next(
        createError("Passwords do not match", 400, errorCode.invalid),
      );
    }

    const userId = req.userId;
    const user = await getUserById(userId);
    checkUserIfNotExist(user);

    const isMatchPassword = await bcrypt.compare(
      currentPassword,
      user!.password,
    );
    if (!isMatchPassword) {
      return next(
        createError("Current Password is Wrong", 401, errorCode.invalid),
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    const accessPayload = { id: user!.id };
    const refreshPayload = { id: user!.id, phone: user!.phone };

    const accessToken = jwt.sign(
      accessPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15,
      },
    );
    const refreshToken = jwt.sign(
      refreshPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30days",
      },
    );
    const userUpdateData = {
      password: hashedNewPassword,
      randToken: refreshToken,
    };
    await updateUser(user!.id, userUpdateData);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    res.status(200).json({
      message: "Your password is updated successfully",
      userId: user!.id,
    });
  },
];
