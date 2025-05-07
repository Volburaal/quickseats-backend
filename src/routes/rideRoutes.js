import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    createAvailableRide,
    modifyAvailableRide,
    getAvailableRides,
    createIncomingRide,
    getIncomingRides,
    deleteAvailableRide,
    deleteIncomingRide,
} from "../controllers/rideController.js";

const router = express.Router();

router.post("/chiniot", authenticate(["CHINIOT"]), createIncomingRide);
router.delete("/chiniot/:id", authenticate(["CHINIOT"]), deleteIncomingRide);
router.get("/chiniot", getIncomingRides);

router.post("/faisalabad", authenticate(["FAISALABAD"]), createAvailableRide);
router.put("/faisalabad/:id", authenticate(["FAISALABAD"]), modifyAvailableRide);
router.delete("/faisalabad/:id", authenticate(["FAISALABAD"]), deleteAvailableRide);
router.get("/faisalabad", getAvailableRides);

export default router;