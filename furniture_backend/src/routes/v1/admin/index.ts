import express from "express";
import { getAllUsers } from "../../../controllers/adminControllers/userController";
import { setMaintenance } from "../../../controllers/adminControllers/systemController";

const router = express.Router();
router.get("/users", getAllUsers);
router.post("/maintenance", setMaintenance);
export default router;
