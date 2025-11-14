import express from "express";
import { getAllUsers } from "../../../controllers/adminControllers/userController";

const router = express.Router();
router.use("/users", getAllUsers);

export default router;
