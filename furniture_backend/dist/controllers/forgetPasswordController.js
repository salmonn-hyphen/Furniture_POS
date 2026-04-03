"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOtpForPassword = exports.forgetPassword = void 0;
const express_validator_1 = require("express-validator");
const authService_1 = require("../services/authService");
const auth_1 = require("../utils/auth");
const bcrypt = __importStar(require("bcrypt"));
const generate_1 = require("../utils/generate");
const moment_1 = __importDefault(require("moment"));
const errorCode_1 = require("../config/errorCode");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../utils/error");
exports.forgetPassword = [
    (0, express_validator_1.body)("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            const error = new Error(errors[0].msg);
            error.status = 400;
            error.code = "Error Invalid";
            return next(error);
        }
        let phone = req.body.phone;
        if (phone.slice(0, 2) === "09") {
            phone = phone.substring(2, phone.length);
        }
        const user = await (0, authService_1.getUserByPhone)(phone);
        (0, auth_1.checkUserIfNotExist)(user);
        const otp = 123456;
        // const generateOTP();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp.toString(), salt);
        const token = (0, generate_1.generateToken)();
        const otpInfo = await (0, authService_1.getOtpByPhone)(phone);
        let result;
        const lastRequestOtp = new Date(otpInfo.updatedAt).toLocaleDateString();
        const today = new Date().toLocaleDateString();
        const isSameDate = lastRequestOtp === today;
        (0, auth_1.checkErrorIfSameDate)(isSameDate, otpInfo.error);
        if (!isSameDate) {
            const otpData = {
                otp: hashedOtp,
                rememberToken: token,
                count: 1,
                error: 0,
            };
            result = await (0, authService_1.updateOtp)(otpInfo.id, otpData);
        }
        else {
            //If the request is the same date and over limit
            if (otpInfo.count === 3) {
                const error = new Error("Allowed to request OTP 3 times per a day, Try Later");
                error.status = 409;
                error.code = "Error_OverLimit";
                throw error;
            }
            else {
                const otpData = {
                    otp: hashedOtp,
                    rememberToken: token,
                    count: {
                        increment: 1,
                    },
                };
                result = await (0, authService_1.updateOtp)(otpInfo.id, otpData);
            }
        }
        res.status(200).json({
            message: `Sending OTP to 09${result.phone} to reset password`,
            phone: result.phone,
            token: result.rememberToken,
        });
    },
];
exports.verifyOtpForPassword = [
    (0, express_validator_1.body)("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    (0, express_validator_1.body)("otp", "Invalid OTP Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 6, max: 6 }),
    (0, express_validator_1.body)("token", "Invalid Token").trim().notEmpty().escape(),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            const error = new Error(errors[0].msg);
            error.status = 400;
            error.code = "Error_Invalid";
        }
        const { phone, otp, token } = req.body;
        const user = (0, authService_1.getUserByPhone)(phone);
        (0, auth_1.checkUserIfNotExist)(user);
        const otpInfo = await (0, authService_1.getOtpByPhone)(phone);
        const lastVerifyOtp = new Date(otpInfo.updatedAt).toDateString();
        const today = new Date().toDateString();
        const isSameDate = lastVerifyOtp === today;
        (0, auth_1.checkErrorIfSameDate)(isSameDate, otpInfo.error);
        if (otpInfo?.rememberToken !== token) {
            const otpData = {
                error: 5,
            };
            await (0, authService_1.updateOtp)(otpInfo.id, otpData);
            const error = new Error("Invalid Token");
            error.status = 401;
            error.code = "Error_Invalid";
            return next(error);
        }
        // Is OTP expired?
        const isExpired = (0, moment_1.default)().diff(otpInfo?.updatedAt, "minutes") > 2;
        if (isExpired) {
            const error = new Error("OTP is Expired, Try Again..");
            error.status = 401;
            error.code = "Expired_Error";
            return next(error);
        }
        //Is Otp match ?
        const isMatchOtp = await bcrypt.compare(otp, otpInfo.otp);
        if (!isMatchOtp) {
            if (!isSameDate) {
                //It is the first time today
                const otpData = {
                    count: 1,
                };
                await (0, authService_1.updateOtp)(otpInfo.id, otpData);
            }
            else {
                const otpData = {
                    count: {
                        increment: 1,
                    },
                };
                await (0, authService_1.updateOtp)(otpInfo.id, otpData);
                const error = new Error("OTP is incorrect");
                error.status = 401;
                error.code = errorCode_1.errorCode.invalid;
                return next(error);
            }
        }
        const verifyToken = (0, generate_1.generateToken)();
        const otpData = {
            verifyToken,
            error: 0,
            count: 1,
        };
        const result = await (0, authService_1.updateOtp)(otpInfo.id, otpData);
        res.status(200).json({
            message: "OTP is verified successfully",
            phone: result.phone,
            token: result.verifyToken,
        });
    },
];
exports.resetPassword = [
    (0, express_validator_1.body)("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    (0, express_validator_1.body)("password", "Password Invalid")
        .trim()
        .notEmpty()
        .isLength({ min: 8, max: 8 }),
    (0, express_validator_1.body)("token", "Invalid Token").trim().notEmpty().escape(),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { phone, password, token } = req.body;
        // check if the user is already exist
        const user = await (0, authService_1.getUserByPhone)(phone);
        (0, auth_1.checkUserIfNotExist)(user);
        //check the user is already exist in otp
        const otpInfo = await (0, authService_1.getOtpByPhone)(phone);
        //If error is overlimit, user cannot reach this stage
        if (otpInfo?.error == 5) {
            return next((0, error_1.createError)("This request may be an attack", 400, errorCode_1.errorCode.attack));
        }
        //check verify token is match
        if (otpInfo?.verifyToken !== token) {
            const otpData = {
                error: 5,
            };
            await (0, authService_1.updateOtp)(otpInfo.id, otpData);
            return next((0, error_1.createError)("Token is invalid", 400, errorCode_1.errorCode.invalid));
        }
        //check request is expired
        const isExpired = (0, moment_1.default)().diff(otpInfo?.updatedAt, "minutes") > 10;
        if (isExpired) {
            return next((0, error_1.createError)("Your Request is expired, try again", 403, errorCode_1.errorCode.requestExpired));
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const accessPayload = { id: user.id };
        const refreshPayload = { id: user.id, phone: user.phone };
        const accessToken = jsonwebtoken_1.default.sign(accessPayload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 60 * 15,
        });
        const refreshToken = jsonwebtoken_1.default.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "30days",
        });
        const userUpdateData = {
            password: hashedPassword,
            randToken: refreshToken,
        };
        await (0, authService_1.updateUser)(user.id, userUpdateData);
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
            userId: user.id,
        });
    },
];
//# sourceMappingURL=forgetPasswordController.js.map