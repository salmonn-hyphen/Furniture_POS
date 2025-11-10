import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  createOtp,
  getUserByPhone,
  getOtpByPhone,
  updateOtp,
} from "../services/authService";
import { checkUser, checkErrorIfSameDate, checkOtpInfo } from "../utils/auth";
import { generateOtp, generateToken } from "../utils/generate";
import * as bcrypt from "bcrypt";
import moment from "moment";

export const register = [
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
    if (phone.slice(0.2) == "09") {
      phone = phone.substring(2, phone.length);
    }
    const user = await getUserByPhone(phone);
    checkUser(user);
    const otp = 123456;
    //const otp = generateOtp();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), salt);
    const token = generateToken();

    //Check OPT is already exist?
    const otpInfo = await getOtpByPhone(phone);
    let result;
    //If OTP never request
    if (!otpInfo) {
      const otpData = {
        phone,
        otp: hashedOtp,
        rememberToken: token,
        count: 1,
      };
      result = await createOtp(otpData);
    } else {
      const lastRequestOtp = new Date(otpInfo.updatedAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();
      const isSameDate = lastRequestOtp === today;
      checkErrorIfSameDate(isSameDate, otpInfo.error);

      //If OTP request is not the same date
      if (!isSameDate) {
        const otpData = {
          otp: hashedOtp,
          rememberToken: token,
          count: 1,
          error: 0,
        };
        result = await updateOtp(otpInfo.id, otpData);
      } else {
        //If the request is the same date and over limit
        if (otpInfo.count === 3) {
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
          result = await updateOtp(otpInfo.id, otpData);
        }
      }
    }

    res.status(200).json({
      message: `we are sending OTP to ${result.phone}`,
      phone: result.phone,
      token: result.rememberToken,
    });
  },
];

export const verifyOtp = [
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
    const user = await getUserByPhone(phone);
    checkUser(user);

    const otpInfo = await getOtpByPhone(phone);
    checkOtpInfo(otpInfo);

    const lastVerifyOtp = new Date(otpInfo!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const isSameDate = lastVerifyOtp === today;
    checkErrorIfSameDate(isSameDate, otpInfo!.error);

    let result;
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

    //Is OTP match?
    const isMatchOtp = await bcrypt.compare(otp, otpInfo!.otp);
    if (!isMatchOtp) {
      if (!isSameDate) {
        //Is it the first time error today?
        const otpData = {
          count: 1,
        };
        await updateOtp(otpInfo!.id, otpData);
      } else {
        //It is not the first time error today
        const otpData = {
          count: { increment: 1 },
        };
        await updateOtp(otpInfo!.id, otpData);
        const error: any = new Error("OTP is Incorrect");
        error.status = 401;
        error.code = "Expired_Invalid";
        return next(error);
      }
    }

    const verifyToken = generateToken();
    const otpData = {
      verifyToken,
      error: 0,
      count: 1,
    };
    result = await updateOtp(otpInfo!.id, otpData);
    res.status(200).json({
      message: "OTP is verified successfully",
      phone: result.phone,
      token: result.verifyToken,
    });
  },
];

export const confirmPassword = [
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "confirmPassword" });
  },
];

export const login = [
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "login" });
  },
];
