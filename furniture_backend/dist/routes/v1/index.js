"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoutes_1 = __importDefault(require("./authRoutes"));
const index_1 = __importDefault(require("./admin/index"));
const api_1 = __importDefault(require("./api"));
const authorize_1 = require("../../middlewares/authorize");
const auth_1 = require("../../middlewares/auth");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//router.use("/api/v1", healthRoute);
router.use("/api/v1/", authRoutes_1.default);
router.use("/api/v1/admins", auth_1.auth, (0, authorize_1.authorize)(true, "ADMIN"), index_1.default);
router.use("/api/v1/user", api_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map