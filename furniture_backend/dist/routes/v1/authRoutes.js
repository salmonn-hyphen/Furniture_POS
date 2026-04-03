"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../../controllers/authController");
const forgetPasswordController_1 = require("../../controllers/forgetPasswordController");
const router = express_1.default.Router();
router.post("/register", authController_1.register);
router.post("/verifyOtp", authController_1.verifyOtp);
router.post("/confirmPassword", authController_1.confirmPassword);
router.post("/login", authController_1.login);
router.post("/logout", authController_1.logout);
router.post("/forget-password", forgetPasswordController_1.forgetPassword);
router.post("/verify", forgetPasswordController_1.verifyOtpForPassword);
router.post("/reset-password", forgetPasswordController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map