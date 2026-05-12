import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  getOtpByPhone,
  getUserByPhone,
  updateOtp,
  updateUser,
} from "../services/authService";
import {
  checkErrorIfSameDate,
  checkOtpInfo,
  checkUserIfNotExist,
} from "../utils/auth";
import * as bcrypt from "bcrypt";
import moment from "moment";
import { errorCode } from "../config/errorCode";
import { createError } from "../utils/error";

export const verifyOtpChange = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 }),
  body("otp", "Invalid OTP Number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 6, max: 6 }),
  body("token", "Invalid Token").trim().notEmpty().escape(),
  body("newPassword", "New Password is Invalid")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
  body("reTypePassword", "Retype-Password is Invalid")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { phone, otp, token, newPassword, reTypePassword } = req.body;
    if (newPassword !== reTypePassword) {
      return next(
        createError("Passwords do not match", 400, errorCode.invalid),
      );
    }

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    const otpInfo = await getOtpByPhone(phone);
    checkOtpInfo(otpInfo);

    const lastVerifyOtp = new Date(otpInfo!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const isSameDate = lastVerifyOtp === today;
    checkErrorIfSameDate(isSameDate, otpInfo!.error);

    if (otpInfo?.rememberToken !== token) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpInfo!.id, otpData);
      return next(createError("Invalid Token", 401, errorCode.invalid));
    }

    // Is OTP expired?
    const isExpired = moment().diff(otpInfo?.updatedAt, "minutes") > 2;
    if (isExpired) {
      return next(
        createError("OTP is Expired, Try Again..", 401, errorCode.otpExpired),
      );
    }

    // Is OTP match?
    const isMatchOtp = await bcrypt.compare(otp, otpInfo!.otp);
    if (!isMatchOtp) {
      if (!isSameDate) {
        const otpData = {
          count: 1,
        };
        await updateOtp(otpInfo!.id, otpData);
      } else {
        const otpData = {
          count: { increment: 1 },
        };
        await updateOtp(otpInfo!.id, otpData);
        return next(createError("OTP is Incorrect", 401, errorCode.invalid));
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updateUser(user!.id, { password: hashedPassword });

    const otpData = {
      error: 0,
      count: 1,
    };
    await updateOtp(otpInfo!.id, otpData);

    res.status(200).json({
      message: "Your password is updated successfully",
      userId: user!.id,
    });
  },
];
