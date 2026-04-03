"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenance = void 0;
const settingService_1 = require("../services/settingService");
const error_1 = require("../utils/error");
const errorCode_1 = require("../config/errorCode");
const whiteList = ["127.0.0.1"];
const maintenance = async (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (whiteList.includes(ip)) {
        console.log(`${ip} is allowed `);
        next();
    }
    else {
        const isMaintenance = await (0, settingService_1.getSettingStatus)("maintenance");
        if (isMaintenance?.value === "true") {
            return next((0, error_1.createError)("The Server is currently under maintenance, Please try again later", 503, errorCode_1.errorCode.maintenance));
        }
        next();
    }
};
exports.maintenance = maintenance;
//# sourceMappingURL=maintenance.js.map