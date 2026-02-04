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
import {
  getInfinitePostsByPagination,
  getPost,
  getPostsByPagination,
} from "../../../controllers/apiControllers/postController";

const router = express.Router();

router.post("/change-language", maintenance, changeLanguage);
router.post("/test-permission", auth, testPermission);

//Routes for upload user avatar
router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile);
router.patch(
  "/profile/upload/multiple",
  auth,
  upload.array("avatar"),
  uploadProfileMultiple,
);
router.patch(
  "/profile/upload/image-optimization",
  auth,
  upload.single("avatar"),
  uploadProfileOptimization,
);

//Routes for get post details
router.get("/posts", auth, getPostsByPagination); // Offset Pagination
router.get("/posts/infinite", auth, getInfinitePostsByPagination); // Cursor-based Pagination
router.get("/posts/:id", auth, getPost);
export default router;
