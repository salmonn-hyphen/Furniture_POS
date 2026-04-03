"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMaintenance = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("../../utils/error");
const errorCode_1 = require("../../config/errorCode");
const settingService_1 = require("../../services/settingService");
exports.setMaintenance = [
    (0, express_validator_1.body)("mode", "Mode must be boolean").isBoolean(),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        //If validation error occurs
        if (errors.length > 0) {
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { mode } = req.body;
        const value = mode ? "true" : "false";
        const message = mode
            ? "Successfully set maintenance mode"
            : "Successfully turn off maintenance mode";
        await (0, settingService_1.createOrUpdateSettingStatus)("maintenance", value);
        res.status(200).json({ message });
    },
];
//# sourceMappingURL=systemController.js.map