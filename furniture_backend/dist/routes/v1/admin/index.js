"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../../controllers/adminControllers/userController");
const systemController_1 = require("../../../controllers/adminControllers/systemController");
const uploadFile_1 = __importDefault(require("../../../middlewares/uploadFile"));
const postController_1 = require("../../../controllers/adminControllers/postController");
const productController_1 = require("../../../controllers/adminControllers/productController");
const router = express_1.default.Router();
router.get("/users", userController_1.getAllUsers);
router.post("/maintenance", systemController_1.setMaintenance);
//CRUD posts
router.post("/posts", uploadFile_1.default.single("image"), postController_1.createPost);
router.patch("/posts", uploadFile_1.default.single("image"), postController_1.updatePost);
router.delete("/posts", postController_1.deletePost);
//CRUD products
router.post("/products", uploadFile_1.default.array("image", 4), productController_1.createProduct);
router.patch("/products", uploadFile_1.default.array("image", 4), productController_1.updateProduct);
router.delete("/products", productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=index.js.map