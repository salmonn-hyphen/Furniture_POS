import express from "express";
import {
  changeLanguage,
  testPermission,
  uploadProfile,
  uploadProfileMultiple,
  uploadProfileOptimization,
} from "../../../controllers/apiControllers/profileController";
import { auth } from "../../../middlewares/auth";
import { maintenance } from "../../../middlewares/maintenance";
import upload, { uploadMemory } from "../../../middlewares/uploadFile";

const router = express.Router();

router.post("/change-language", maintenance, changeLanguage);
router.post("/test-permission", auth, testPermission);
router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile);
router.patch(
  "/profile/upload/multiple",
  auth,
  upload.array("avatar"),
  uploadProfileMultiple
);
router.patch(
  "/profile/upload/image-optimization",
  auth,
  upload.single("avatar"),
  uploadProfileOptimization
);
export default router;
