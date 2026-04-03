import express from "express";
import { getAllUsers } from "../../../controllers/adminControllers/userController";
import { setMaintenance } from "../../../controllers/adminControllers/systemController";
import upload from "../../../middlewares/uploadFile";
import {
  createPost,
  deletePost,
  updatePost,
} from "../../../controllers/adminControllers/postController";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../../controllers/adminControllers/productController";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/maintenance", setMaintenance);

//CRUD posts
router.post("/posts", upload.single("image"), createPost);
router.patch("/posts", upload.single("image"), updatePost);
router.delete("/posts", deletePost);

//CRUD products
router.post("/products", upload.array("image", 4), createProduct);
router.patch("/products", upload.array("image", 4), updateProduct);
router.delete("/products", deleteProduct);
export default router;
