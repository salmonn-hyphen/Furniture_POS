import authRoute from "./authRoutes";
import userRoute from "./admin";
import profileRoute from "./api";
import { authorize } from "../../middlewares/authorize";
import healthRoute from "./checkRoute";
import { auth } from "../../middlewares/auth";
import express, { NextFunction } from "express";

const router = express();

//router.use("/api/v1", healthRoute);
router.use("/api/v1/", authRoute);
router.use("/api/v1/admins", auth, authorize(true, "AUTHOR"), userRoute);
router.use("/api/v1/user", profileRoute);

export default router;
