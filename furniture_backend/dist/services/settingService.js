"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateSettingStatus = exports.getSettingStatus = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const getSettingStatus = async (key) => {
    return prisma.setting.findUnique({
        where: { key },
    });
};
exports.getSettingStatus = getSettingStatus;
const createOrUpdateSettingStatus = async (key, value) => {
    return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: {
            key,
            value,
        },
    });
};
exports.createOrUpdateSettingStatus = createOrUpdateSettingStatus;
//# sourceMappingURL=settingService.js.map