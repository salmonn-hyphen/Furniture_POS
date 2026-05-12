import express from "express";
import {
  authCheck,
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
import { auth } from "../../middlewares/auth";
import { changePassword } from "../../controllers/changePassword";

const router = express.Router();

router.post("/register", register);
router.post("/verifyOtp", verifyOtp);
router.post("/confirmPassword", confirmPassword);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forget-password", forgetPassword);
router.post("/verify", verifyOtpForPassword);
router.post("/reset-password", resetPassword);

router.post("/change-password", auth, changePassword);


//auth check
router.get("/auth-check", auth, authCheck);
export default router;
