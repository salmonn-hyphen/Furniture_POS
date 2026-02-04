import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  createOtp,
  getUserByPhone,
  getOtpByPhone,
  updateOtp,
  createUser,
  updateUser,
  getUserById,
} from "../services/authService";
import {
  checkUser,
  checkErrorIfSameDate,
  checkOtpInfo,
  checkUserIfNotExist,
} from "../utils/auth";
import { generateOtp, generateToken } from "../utils/generate";
import * as bcrypt from "bcrypt";
import moment from "moment";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { createError } from "../utils/error";
import { errorCode } from "../config/errorCode";

export const register = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
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
          throw createError(
            "Allowed to request OTP 3 times per a day, Try Later",
            409,
            errorCode.overLimit
          );
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
      return next(createError(errors[0].msg, 400, errorCode.invalid));
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
        createError("OTP is Expired, Try Again..", 401, errorCode.otpExpired)
      );
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
        return next(createError("OTP is Incorrect", 401, errorCode.invalid));
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

export const confirmPassword = [
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
    //Check the infos
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { phone, password, token } = req.body;

    //Check is the user already exist in user
    const user = await getUserByPhone(phone);
    checkUser(user);
    //Check is the user already exist in otp
    const otpInfo = await getOtpByPhone(phone);
    checkOtpInfo(otpInfo);

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

    //encrypt the password and create an account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const randToken = "will be replaced";
    const userData = {
      phone,
      password: hashedPassword,
      randToken,
    };
    const newUser = await createUser(userData);

    const accessPayload = { id: newUser.id };
    const refreshPayload = { id: newUser.id, phone: newUser.phone };

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
      randToken: refreshToken,
    };
    await updateUser(newUser.id, userUpdateData);

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

    res
      .status(200)
      .json({ message: "Created an account successfully", userId: newUser.id });
  },
];

export const login = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 }),
  body("password", "Password Invalid")
    .trim()
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { phone, password } = req.body;
    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);
    //If the account was freeze
    if (user?.status === "FREEZE") {
      return next(
        createError(
          "Your account is temporarily locked,Contact us",
          400,
          errorCode.accountFreeze
        )
      );
    }
    //Check is the password correct
    const isMatchPassword = await bcrypt.compare(password, user!.password);
    if (!isMatchPassword) {
      //Record the wrong times
      const lastRequest = new Date(user!.updatedAt).toLocaleDateString();
      const isSameDate = lastRequest == new Date().toLocaleDateString();
      //Password is wrong first time in this day
      if (isSameDate) {
        const userData = {
          errorLoginCount: 1,
        };
        await updateUser(user!.id, userData);
      } else {
        //Password was wrong more than 2 times in a day
        if (user!.errorLoginCount >= 2) {
          const userData = {
            status: "FREEZE",
          };
          await updateUser(user!.id, userData);
        } else {
          //Password was already wrong one time
          const userData = {
            errorLoginCount: { increment: 1 },
          };
          await updateUser(user!.id, userData);
        }
      }
      return next(createError(req.t("wrongPass"), 401, errorCode.invalid));
    }

    const accessPayload = { id: user!.id };
    const refreshPayload = { id: user!.id, phone: user!.phone };

    const accessToken = jwt.sign(
      accessPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15, //15 minutes
      }
    );
    const refreshToken = jwt.sign(
      refreshPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30days",
      }
    );
    const userData = {
      errorLoginCount: 0,
      randToken: refreshToken,
    };
    await updateUser(user!.id, userData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      })
      .status(200)
      .json({ message: "Successfully Logged In.", userId: user?.id });
  },
];

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //clear http only cookie and update randToken in user table
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  if (!refreshToken) {
    return next(
      createError(
        "You are not an authenticated user!",
        401,
        errorCode.unauthenticated
      )
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
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
  checkUserIfNotExist(user);

  if (user!.phone !== decoded.phone) {
    return next(
      createError(
        "You are not an authenticated user!",
        401,
        errorCode.unauthenticated
      )
    );
  }

  const userData = {
    randToken: generateToken(),
  };
  await updateUser(user!.id, userData);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Successfully Logged Out" });
};
