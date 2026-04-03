"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.generateOtp = void 0;
const crypto_1 = require("crypto");
const generateOtp = () => {
    return (parseInt((0, crypto_1.randomBytes)(3).toString("hex"), 16) % 900000) + 100000;
};
exports.generateOtp = generateOtp;
const generateToken = () => {
    return (0, crypto_1.randomBytes)(32).toString("hex");
};
exports.generateToken = generateToken;
//# sourceMappingURL=generate.js.map