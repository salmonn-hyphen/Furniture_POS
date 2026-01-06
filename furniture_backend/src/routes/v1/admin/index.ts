import express from "express";
import { getAllUsers } from "../../../controllers/adminControllers/userController";
import { setMaintenance } from "../../../controllers/adminControllers/systemController";
import upload from "../../../middlewares/uploadFile";
import {
  createPost,
  deletePost,
  // deletePost,
  updatePost,
} from "../../../controllers/adminControllers/postController";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/maintenance", setMaintenance);
//CRUD posts
router.post("/posts", upload.single("image"), createPost);
router.patch("/posts", upload.single("image"), updatePost);
router.delete("/posts", deletePost);
export default router;
