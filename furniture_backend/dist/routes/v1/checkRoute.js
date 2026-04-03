"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const check_1 = require("../../middlewares/check");
const checkController_1 = require("../../controllers/checkController");
const router = express_1.default.Router();
router.get("/check", check_1.check, checkController_1.healthCheck);
exports.default = router;
//# sourceMappingURL=checkRoute.js.map