import express from "express";
import {
  registerUser,
  adminLogin,
  managerLogin,
  executorLogin,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { name, phone, email?, role, vehicleNumber?, address?, documents? }
 * public registration (not admin)
 */
router.post("/register", registerUser);

/**
 * POST /api/auth/admin/login
 * Body: { email, password }
 */
router.post("/admin/login", adminLogin);
router.post("/manager/login", managerLogin);
router.post("/executor/login", executorLogin);

router.get("/me", protect, getMe);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
