"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const check = (req, res, next) => {
    req.userId = 4122;
    next();
};
exports.check = check;
//# sourceMappingURL=check.js.map