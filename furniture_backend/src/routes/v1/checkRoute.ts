import express from "express";
import { check } from "../../middlewares/check";
import { healthCheck } from "../../controllers/checkController";

const router = express.Router();

router.get("/check", check, healthCheck);

export default router;
