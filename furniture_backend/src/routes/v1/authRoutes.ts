import express from "express";
import {
  confirmPassword,
  login,
  logout,
  register,
  verifyOtp,
} from "../../controllers/authController";
import {
  forgetPassword,
  resetPassword,
  verifyOtpForPassword,
} from "../../controllers/forgetPasswordController";

const router = express.Router();

router.post("/register", register);
router.post("/verifyOtp", verifyOtp);
router.post("/confirmPassword", confirmPassword);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forget-password", forgetPassword);
router.post("/verify", verifyOtpForPassword);
router.post("/reset-password", resetPassword);
export default router;
