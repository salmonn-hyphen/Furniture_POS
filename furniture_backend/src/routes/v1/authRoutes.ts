import express from "express";
import {
  confirmPassword,
  login,
  register,
  verifyOtp,
} from "../../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/verifyOtp", verifyOtp);
router.post("/confirmPassword", confirmPassword);
router.post("/login", login);

export default router;
