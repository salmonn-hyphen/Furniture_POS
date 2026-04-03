"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authService_1 = require("../services/authService");
const errorCode_1 = require("../config/errorCode");
const error_1 = require("../utils/error");
const authorize = (permission, ...roles) => {
    return async (req, res, next) => {
        const userId = req.userId;
        const user = await (0, authService_1.getUserById)(userId);
        if (!user) {
            return next((0, error_1.createError)("This account has not been registered!", 401, errorCode_1.errorCode.unauthenticated));
        }
        const result = roles.includes(user.role);
        if (permission && !result) {
            return next((0, error_1.createError)("This action is not allowed!", 403, errorCode_1.errorCode.unauthorized));
        }
        if (!permission && result) {
            return next((0, error_1.createError)("This action is not allowed!", 403, errorCode_1.errorCode.unauthorized));
        }
        req.user = user;
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map