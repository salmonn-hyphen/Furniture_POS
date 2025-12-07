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
import { generateToken } from "../utils/generate";
import { crossOriginResourcePolicy } from "helmet";
import moment from "moment";
import { errorCode } from "../config/errorCode";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error";

export const forgetPassword = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = "Error Invalid";
      return next(error);
    }
    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }
    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    const otp = 123456;
    // const generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), salt);
    const token = generateToken();

    const otpInfo = await getOtpByPhone(phone);
    let result;
    const lastRequestOtp = new Date(otpInfo!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const isSameDate = lastRequestOtp === today;
    checkErrorIfSameDate(isSameDate, otpInfo!.error);
    if (!isSameDate) {
      const otpData = {
        otp: hashedOtp,
        rememberToken: token,
        count: 1,
        error: 0,
      };
      result = await updateOtp(otpInfo!.id, otpData);
    } else {
      //If the request is the same date and over limit
      if (otpInfo!.count === 3) {
        const error: any = new Error(
          "Allowed to request OTP 3 times per a day, Try Later"
        );
        error.status = 409;
        error.code = "Error_OverLimit";
        throw error;
      } else {
        const otpData = {
          otp: hashedOtp,
          rememberToken: token,
          count: {
            increment: 1,
          },
        };
        result = await updateOtp(otpInfo!.id, otpData);
      }
    }
    res.status(200).json({
      message: `Sending OTP to 09${result.phone} to reset password`,
      phone: result.phone,
      token: result.rememberToken,
    });
  },
];

export const verifyOtpForPassword = [
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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = "Error_Invalid";
    }
    const { phone, otp, token } = req.body;
    const user = getUserByPhone(phone);
    checkUserIfNotExist(user);
    const otpInfo = await getOtpByPhone(phone);

    const lastVerifyOtp = new Date(otpInfo!.updatedAt).toDateString();
    const today = new Date().toDateString();
    const isSameDate = lastVerifyOtp === today;
    checkErrorIfSameDate(isSameDate, otpInfo!.error);

    if (otpInfo?.rememberToken !== token) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpInfo!.id, otpData);
      const error: any = new Error("Invalid Token");
      error.status = 401;
      error.code = "Error_Invalid";
      return next(error);
    }

    // Is OTP expired?
    const isExpired = moment().diff(otpInfo?.updatedAt, "minutes") > 2;
    if (isExpired) {
      const error: any = new Error("OTP is Expired, Try Again..");
      error.status = 401;
      error.code = "Expired_Error";
      return next(error);
    }

    //Is Otp match ?
    const isMatchOtp = await bcrypt.compare(otp, otpInfo!.otp);
    if (!isMatchOtp) {
      if (!isSameDate) {
        //It is the first time today
        const otpData = {
          count: 1,
        };
        await updateOtp(otpInfo!.id, otpData);
      } else {
        const otpData = {
          count: {
            increment: 1,
          },
        };
        await updateOtp(otpInfo!.id, otpData);
        const error: any = new Error("OTP is incorrect");
        error.status = 401;
        error.code = errorCode.invalid;
        return next(error);
      }
    }
    const verifyToken = generateToken();
    const otpData = {
      verifyToken,
      error: 0,
      count: 1,
    };
    const result = await updateOtp(otpInfo!.id, otpData);

    res.status(200).json({
      message: "OTP is verified successfully",
      phone: result.phone,
      token: result.verifyToken,
    });
  },
];

export const resetPassword = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 }),
  body("password", "Password Invalid")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
  body("token", "Invalid Token").trim().notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { phone, password, token } = req.body;
    // check if the user is already exist
    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);
    //check the user is already exist in otp
    const otpInfo = await getOtpByPhone(phone);

    //If error is overlimit, user cannot reach this stage
    if (otpInfo?.error == 5) {
      return next(
        createError("This request may be an attack", 400, errorCode.attack)
      );
    }
    //check verify token is match
    if (otpInfo?.verifyToken !== token) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpInfo!.id, otpData);
      return next(createError("Token is invalid", 400, errorCode.invalid));
    }
    //check request is expired
    const isExpired = moment().diff(otpInfo?.updatedAt, "minutes") > 10;
    if (isExpired) {
      return next(
        createError(
          "Your Request is expired, try again",
          403,
          errorCode.requestExpired
        )
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const accessPayload = { id: user!.id };
    const refreshPayload = { id: user!.id, phone: user!.phone };

    const accessToken = jwt.sign(
      accessPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15,
      }
    );
    const refreshToken = jwt.sign(
      refreshPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30days",
      }
    );
    const userUpdateData = {
      password: hashedPassword,
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
