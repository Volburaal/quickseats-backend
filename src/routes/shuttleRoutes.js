import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    setLocation,
    getLocation,
} from "../controllers/shuttleController.js";

const router = express.Router();

router.post("/", authenticate(["SHUTTLE"]), setLocation);
router.get("/", getLocation);

export default router;