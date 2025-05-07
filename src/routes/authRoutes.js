import express from "express";
import {authenticate} from "../middleware/auth.js"
import {
  login,
  register,
  reset,
  verify,
  deleteAccount,
  getUnVerifiedAccounts,
  getVerifiedAccounts,
  verifyOtp,
  generateOtp
} from "../controllers/authController.js";

const router = express.Router();

router.get("/unverified",authenticate(["ADMIN"]), getUnVerifiedAccounts)
router.get("/verified",authenticate(["ADMIN"]), getVerifiedAccounts)
router.post("/signup", register);
router.post("/login", login);
router.put("/reset", reset)
router.put("/verify/:id", authenticate(["ADMIN"]), verify)
router.delete("/delete/:id",authenticate(["CHINIOT", "FAISALABAD", "SHUTTLE" , "ADMIN"]), deleteAccount)
router.post("/otpGenerate",generateOtp)
router.post("/otpVerify",verifyOtp)

export default router;
