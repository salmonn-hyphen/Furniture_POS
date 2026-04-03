"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const authService_1 = require("../services/authService");
const error_1 = require("../utils/error");
const errorCode_1 = require("../config/errorCode");
const auth = (req, res, next) => {
    const accessToken = req.cookies ? req.cookies.accessToken : null;
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;
    const generateNewToken = async () => {
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        }
        catch (error) {
            return next((0, error_1.createError)("You are not an authenticated user!", 401, errorCode_1.errorCode.unauthenticated));
        }
        const user = await (0, authService_1.getUserById)(decoded.id);
        if (!user) {
            return next((0, error_1.createError)("This account has not registered!", 401, errorCode_1.errorCode.unauthenticated));
        }
        if (user.phone !== decoded.phone) {
            return next((0, error_1.createError)("This account has not registered!", 401, errorCode_1.errorCode.unauthenticated));
        }
        if (user.randToken !== refreshToken) {
            return next((0, error_1.createError)("This account has not registered!", 401, errorCode_1.errorCode.unauthenticated));
        }
        const accessPayload = { id: user.id };
        const refreshPayload = { id: user.id, phone: user.phone };
        const newAccessToken = jsonwebtoken_1.default.sign(accessPayload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 60 * 15, //15 minutes
        });
        const newRefreshToken = jsonwebtoken_1.default.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "30days",
        });
        const userData = {
            randToken: newRefreshToken,
        };
        await (0, authService_1.updateUser)(user.id, userData);
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
        return next((0, error_1.createError)("You are not an authenticated user!", 401, errorCode_1.errorCode.unauthenticated));
    }
    if (!accessToken) {
        generateNewToken();
    }
    else {
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.userId = decoded.id;
            next();
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                const error = new Error("Access token has been expired!");
                error.status = 401;
                error.code = "Error_Expired";
            }
            else {
                return next((0, error_1.createError)("Access Token is invalid.", 400, errorCode_1.errorCode.attack));
            }
        }
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map