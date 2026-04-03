"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.updateUser = exports.createUser = exports.updateOtp = exports.getOtpByPhone = exports.createOtp = exports.getUserByPhone = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const getUserByPhone = async (phone) => {
    return prisma.user.findUnique({
        where: { phone },
    });
};
exports.getUserByPhone = getUserByPhone;
const createOtp = async (otpData) => {
    return prisma.otp.create({
        data: otpData,
    });
};
exports.createOtp = createOtp;
const getOtpByPhone = async (phone) => {
    return prisma.otp.findUnique({
        where: { phone },
    });
};
exports.getOtpByPhone = getOtpByPhone;
const updateOtp = async (id, otpData) => {
    return prisma.otp.update({
        where: { id },
        data: otpData,
    });
};
exports.updateOtp = updateOtp;
const createUser = async (userData) => {
    return prisma.user.create({
        data: userData,
    });
};
exports.createUser = createUser;
const updateUser = async (id, userData) => {
    return prisma.user.update({
        where: { id },
        data: userData,
    });
};
exports.updateUser = updateUser;
const getUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
    });
};
exports.getUserById = getUserById;
//# sourceMappingURL=authService.js.map