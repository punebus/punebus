import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { updatePanelConfig, getPanelConfig } from "../controllers/panelConfigController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/:role", getPanelConfig);
router.put("/:role", updatePanelConfig);

export default router;
