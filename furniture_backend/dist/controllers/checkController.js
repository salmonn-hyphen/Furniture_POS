"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const healthCheck = (req, res, next) => {
    res.status(200).json({
        message: "Hello World, the response is ready",
        userId: req.userId,
    });
};
exports.healthCheck = healthCheck;
//# sourceMappingURL=checkController.js.map