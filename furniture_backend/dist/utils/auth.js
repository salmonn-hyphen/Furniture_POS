"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserIfNotExist = exports.checkOtpInfo = exports.checkErrorIfSameDate = exports.checkUser = void 0;
const checkUser = (user) => {
    if (user) {
        const error = new Error("This phone number has been already registered");
        error.status = 409;
        error.code = "Already_Registered";
        throw error;
    }
};
exports.checkUser = checkUser;
const checkErrorIfSameDate = (isSameDate, errorCount) => {
    if (isSameDate && errorCount === 5) {
        const error = new Error("OTP is wrong for 5 times, Please Try ");
        error.status = 401;
        error.code = "Error_OverLimit";
        throw error;
    }
};
exports.checkErrorIfSameDate = checkErrorIfSameDate;
const checkOtpInfo = (otpInfo) => {
    if (!otpInfo) {
        const error = new Error("Phone Number is incorrect");
        error.status = 400;
        error.code = "Error_Invalid";
        throw error;
    }
};
exports.checkOtpInfo = checkOtpInfo;
const checkUserIfNotExist = (user) => {
    if (!user) {
        const error = new Error("This phone has not registered");
        error.status = 401;
        error.code = "Error_Unauthenticated";
        throw error;
    }
};
exports.checkUserIfNotExist = checkUserIfNotExist;
//# sourceMappingURL=auth.js.map