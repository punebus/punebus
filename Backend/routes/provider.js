import express from "express";
import { protect, adminOnly, roleOnly } from "../middleware/auth.js";
import {
  listProviders,
  getProviderById,
  managerApproveProvider,
  approveProvider,
  rejectProvider,
  deleteProvider,
} from "../controllers/providerController.js";

const router = express.Router();

router.use(protect);

router.get("/", roleOnly(["admin", "manager"]), listProviders);
router.get("/:id", roleOnly(["admin", "manager"]), getProviderById);
router.put("/:id/manager-approve", roleOnly(["manager"]), managerApproveProvider);
router.put("/:id/approve", adminOnly, approveProvider);
router.put("/:id/reject", adminOnly, rejectProvider);
router.delete("/:id", adminOnly, deleteProvider);

export default router;
