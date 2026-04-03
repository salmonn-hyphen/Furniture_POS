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
exports.logout = exports.login = exports.confirmPassword = exports.verifyOtp = exports.register = void 0;
const express_validator_1 = require("express-validator");
const authService_1 = require("../services/authService");
const auth_1 = require("../utils/auth");
const generate_1 = require("../utils/generate");
const bcrypt = __importStar(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const error_1 = require("../utils/error");
const errorCode_1 = require("../config/errorCode");
exports.register = [
    (0, express_validator_1.body)("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        let phone = req.body.phone;
        if (phone.slice(0.2) == "09") {
            phone = phone.substring(2, phone.length);
        }
        const user = await (0, authService_1.getUserByPhone)(phone);
        (0, auth_1.checkUser)(user);
        const otp = 123456;
        //const otp = generateOtp();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp.toString(), salt);
        const token = (0, generate_1.generateToken)();
        //Check OPT is already exist?
        const otpInfo = await (0, authService_1.getOtpByPhone)(phone);
        let result;
        //If OTP never request
        if (!otpInfo) {
            const otpData = {
                phone,
                otp: hashedOtp,
                rememberToken: token,
                count: 1,
            };
            result = await (0, authService_1.createOtp)(otpData);
        }
        else {
            const lastRequestOtp = new Date(otpInfo.updatedAt).toLocaleDateString();
            const today = new Date().toLocaleDateString();
            const isSameDate = lastRequestOtp === today;
            (0, auth_1.checkErrorIfSameDate)(isSameDate, otpInfo.error);
            //If OTP request is not the same date
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
                    throw (0, error_1.createError)("Allowed to request OTP 3 times per a day, Try Later", 409, errorCode_1.errorCode.overLimit);
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
        }
        res.status(200).json({
            message: `we are sending OTP to ${result.phone}`,
            phone: result.phone,
            token: result.rememberToken,
        });
    },
];
exports.verifyOtp = [
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
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { phone, otp, token } = req.body;
        const user = await (0, authService_1.getUserByPhone)(phone);
        (0, auth_1.checkUser)(user);
        const otpInfo = await (0, authService_1.getOtpByPhone)(phone);
        (0, auth_1.checkOtpInfo)(otpInfo);
        const lastVerifyOtp = new Date(otpInfo.updatedAt).toLocaleDateString();
        const today = new Date().toLocaleDateString();
        const isSameDate = lastVerifyOtp === today;
        (0, auth_1.checkErrorIfSameDate)(isSameDate, otpInfo.error);
        if (otpInfo?.rememberToken !== token) {
            const otpData = {
                error: 5,
            };
            await (0, authService_1.updateOtp)(otpInfo.id, otpData);
            return next((0, error_1.createError)("Invalid Token", 401, errorCode_1.errorCode.invalid));
        }
        // Is OTP expired?
        const isExpired = (0, moment_1.default)().diff(otpInfo?.updatedAt, "minutes") > 2;
        if (isExpired) {
            return next((0, error_1.createError)("OTP is Expired, Try Again..", 401, errorCode_1.errorCode.otpExpired));
        }
        //Is OTP match?
        const isMatchOtp = await bcrypt.compare(otp, otpInfo.otp);
        if (!isMatchOtp) {
            if (!isSameDate) {
                //Is it the first time error today?
                const otpData = {
                    count: 1,
                };
                await (0, authService_1.updateOtp)(otpInfo.id, otpData);
            }
            else {
                //It is not the first time error today
                const otpData = {
                    count: { increment: 1 },
                };
                await (0, authService_1.updateOtp)(otpInfo.id, otpData);
                return next((0, error_1.createError)("OTP is Incorrect", 401, errorCode_1.errorCode.invalid));
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
exports.confirmPassword = [
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
        //Check the infos
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { phone, password, token } = req.body;
        //Check is the user already exist in user
        const user = await (0, authService_1.getUserByPhone)(phone);
        (0, auth_1.checkUser)(user);
        //Check is the user already exist in otp
        const otpInfo = await (0, authService_1.getOtpByPhone)(phone);
        (0, auth_1.checkOtpInfo)(otpInfo);
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
        //encrypt the password and create an account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const randToken = "will be replaced";
        const userData = {
            phone,
            password: hashedPassword,
            randToken,
        };
        const newUser = await (0, authService_1.createUser)(userData);
        const accessPayload = { id: newUser.id };
        const refreshPayload = { id: newUser.id, phone: newUser.phone };
        const accessToken = jsonwebtoken_1.default.sign(accessPayload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 60 * 15,
        });
        const refreshToken = jsonwebtoken_1.default.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "30days",
        });
        const userUpdateData = {
            randToken: refreshToken,
        };
        await (0, authService_1.updateUser)(newUser.id, userUpdateData);
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
exports.login = [
    (0, express_validator_1.body)("phone", "Invalid Phone Number")
        .trim()
        .notEmpty()
        .matches(/^[0-9]+$/)
        .isLength({ min: 5, max: 12 }),
    (0, express_validator_1.body)("password", "Password Invalid")
        .trim()
        .notEmpty()
        .isLength({ min: 8, max: 8 }),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        //If validation error occurs
        if (errors.length > 0) {
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { phone, password } = req.body;
        const user = await (0, authService_1.getUserByPhone)(phone);
        (0, auth_1.checkUserIfNotExist)(user);
        //If the account was freeze
        if (user?.status === "FREEZE") {
            return next((0, error_1.createError)("Your account is temporarily locked,Contact us", 400, errorCode_1.errorCode.accountFreeze));
        }
        //Check is the password correct
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            //Record the wrong times
            const lastRequest = new Date(user.updatedAt).toLocaleDateString();
            const isSameDate = lastRequest == new Date().toLocaleDateString();
            //Password is wrong first time in this day
            if (isSameDate) {
                const userData = {
                    errorLoginCount: 1,
                };
                await (0, authService_1.updateUser)(user.id, userData);
            }
            else {
                //Password was wrong more than 2 times in a day
                if (user.errorLoginCount >= 2) {
                    const userData = {
                        status: "FREEZE",
                    };
                    await (0, authService_1.updateUser)(user.id, userData);
                }
                else {
                    //Password was already wrong one time
                    const userData = {
                        errorLoginCount: { increment: 1 },
                    };
                    await (0, authService_1.updateUser)(user.id, userData);
                }
            }
            return next((0, error_1.createError)(req.t("wrongPass"), 401, errorCode_1.errorCode.invalid));
        }
        const accessPayload = { id: user.id };
        const refreshPayload = { id: user.id, phone: user.phone };
        const accessToken = jsonwebtoken_1.default.sign(accessPayload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 60 * 15, //15 minutes
        });
        const refreshToken = jsonwebtoken_1.default.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "30days",
        });
        const userData = {
            errorLoginCount: 0,
            randToken: refreshToken,
        };
        await (0, authService_1.updateUser)(user.id, userData);
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
const logout = async (req, res, next) => {
    //clear http only cookie and update randToken in user table
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;
    if (!refreshToken) {
        return next((0, error_1.createError)("You are not an authenticated user!", 401, errorCode_1.errorCode.unauthenticated));
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (error) {
        return next((0, error_1.createError)("You are not an authenticated user!", 401, errorCode_1.errorCode.unauthenticated));
    }
    const user = await (0, authService_1.getUserById)(decoded.id);
    (0, auth_1.checkUserIfNotExist)(user);
    if (user.phone !== decoded.phone) {
        return next((0, error_1.createError)("You are not an authenticated user!", 401, errorCode_1.errorCode.unauthenticated));
    }
    const userData = {
        randToken: (0, generate_1.generateToken)(),
    };
    await (0, authService_1.updateUser)(user.id, userData);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Successfully Logged Out" });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map