import Enquiry from "../models/Enquiry.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import PanelConfig from "../models/PanelConfig.js";
import { buildPanelConfigResponse } from "./panelConfigController.js";

const PANEL_CONFIG = {
  admin: {
    title: "Admin Panel",
    permissions: ["Create panel users", "Manage enquiries", "Manage subscriptions", "Manage all users"],
  },
  manager: {
    title: "Manager Panel",
    permissions: ["Monitor enquiries", "Review subscriptions", "Coordinate executor work"],
  },
  executor: {
    title: "Executor Panel",
    permissions: ["Track pending enquiries", "Update field work", "Follow customer tasks"],
  },
};

export const getPanelOverview = async (req, res) => {
  const [totalUsers, totalEnquiries, pendingEnquiries, completedEnquiries, activeSubscriptions] =
    await Promise.all([
      User.countDocuments({}),
      Enquiry.countDocuments({}),
      Enquiry.countDocuments({ status: "pending" }),
      Enquiry.countDocuments({ status: "done" }),
      Subscription.countDocuments({ status: "active" }),
    ]);

  const savedConfig =
    req.user.role === "admin"
      ? null
      : await PanelConfig.findOne({ role: req.user.role });
  const roleConfig = savedConfig ? buildPanelConfigResponse(req.user.role, savedConfig) : buildPanelConfigResponse(req.user.role);
  const panelDefaults = PANEL_CONFIG[req.user.role] || {
    title: `${req.user.role} Panel`,
    permissions: [],
  };
  const visibleSections = req.user.role === "admin" ? [] : roleConfig.visibleSections;
  const canSeeMetrics = req.user.role === "admin" || visibleSections.includes("metrics");

  res.json({
    panel: {
      ...panelDefaults,
      permissions: req.user.role === "admin" ? panelDefaults.permissions : roleConfig.permissions,
    },
    visibleSections,
    profile: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
    metrics: canSeeMetrics ? {
      totalUsers,
      totalEnquiries,
      pendingEnquiries,
      completedEnquiries,
      activeSubscriptions,
    } : {},
  });
};
