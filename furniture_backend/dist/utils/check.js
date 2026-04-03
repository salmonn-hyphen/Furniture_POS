"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkModelIfExist = exports.checkFile = void 0;
const errorCode_1 = require("../config/errorCode");
const checkFile = (file) => {
    if (!file) {
        const error = new Error("Invalid Image");
        error.status = 409;
        error.code = errorCode_1.errorCode.invalid;
        throw error;
    }
};
exports.checkFile = checkFile;
const checkModelIfExist = (model) => {
    if (!model) {
        const error = new Error("This model does not exist.");
        error.status = 409;
        error.code = errorCode_1.errorCode.invalid;
        throw error;
    }
};
exports.checkModelIfExist = checkModelIfExist;
//# sourceMappingURL=check.js.map