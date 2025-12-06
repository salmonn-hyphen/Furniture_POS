import express from "express";
import {
  changeLanguage,
  testPermission,
} from "../../../controllers/apiControllers/profileController";
import { auth } from "../../../middlewares/auth";

const router = express.Router();

router.post("/change-language", changeLanguage);
router.post("/test-permission", auth, testPermission);
export default router;
