import express from "express";
import { protect, roleOnly } from "../middleware/auth.js";
import { getPanelOverview } from "../controllers/panelController.js";

const router = express.Router();

router.use(protect, roleOnly(["admin", "manager", "executor"]));

router.get("/overview", getPanelOverview);

export default router;
