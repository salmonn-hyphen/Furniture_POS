"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../../../controllers/apiControllers/profileController");
const auth_1 = require("../../../middlewares/auth");
const maintenance_1 = require("../../../middlewares/maintenance");
const uploadFile_1 = __importDefault(require("../../../middlewares/uploadFile"));
const postController_1 = require("../../../controllers/apiControllers/postController");
const productController_1 = require("../../../controllers/apiControllers/productController");
const router = express_1.default.Router();
router.post("/change-language", maintenance_1.maintenance, profileController_1.changeLanguage);
router.post("/test-permission", auth_1.auth, profileController_1.testPermission);
//Routes for upload user avatar
router.patch("/profile/upload", auth_1.auth, uploadFile_1.default.single("avatar"), profileController_1.uploadProfile);
router.patch("/profile/upload/multiple", auth_1.auth, uploadFile_1.default.array("avatar"), profileController_1.uploadProfileMultiple);
router.patch("/profile/upload/image-optimization", auth_1.auth, uploadFile_1.default.single("avatar"), profileController_1.uploadProfileOptimization);
//Routes for get post details
router.get("/posts", auth_1.auth, postController_1.getPostsByPagination); // Offset Pagination
router.get("/posts/infinite", auth_1.auth, postController_1.getInfinitePostsByPagination); // Cursor-based Pagination
router.get("/posts/:id", auth_1.auth, postController_1.getPost);
//Routes for get product details
router.get("/products/:id", auth_1.auth, productController_1.getProducts);
exports.default = router;
//# sourceMappingURL=index.js.map