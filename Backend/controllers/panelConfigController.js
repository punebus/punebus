import PanelConfig from "../models/PanelConfig.js";

const CONFIG_ROLES = ["manager", "executor"];

export const PANEL_SECTION_OPTIONS = [
  "profile",
  "metrics",
  "permissions",
];

export const DEFAULT_PANEL_CONFIGS = {
  manager: {
    visibleSections: PANEL_SECTION_OPTIONS,
    permissions: ["Monitor enquiries", "Review subscriptions", "Coordinate executor work"],
  },
  executor: {
    visibleSections: PANEL_SECTION_OPTIONS,
    permissions: ["Track pending enquiries", "Update field work", "Follow customer tasks"],
  },
};

const sanitizeStringList = (items, allowedItems = null) => {
  const allowed = allowedItems ? new Set(allowedItems) : null;
  return [...new Set(
    items
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item && (!allowed || allowed.has(item)))
  )];
};

export const buildPanelConfigResponse = (role, config = null) => {
  const defaults = DEFAULT_PANEL_CONFIGS[role] || { visibleSections: [], permissions: [] };
  return {
    role,
    visibleSections: Array.isArray(config?.visibleSections) ? config.visibleSections : defaults.visibleSections,
    permissions: Array.isArray(config?.permissions) ? config.permissions : defaults.permissions,
    updatedAt: config?.updatedAt || null,
  };
};

export const updatePanelConfig = async (req, res) => {
  const { role } = req.params;
  const { visibleSections, permissions } = req.body;

  if (!role || !CONFIG_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role for panel config" });
  }

  if (!Array.isArray(visibleSections)) {
    return res.status(400).json({ message: "visibleSections must be an array" });
  }

  if (!Array.isArray(permissions)) {
    return res.status(400).json({ message: "permissions must be an array" });
  }

  const nextVisibleSections = sanitizeStringList(visibleSections, PANEL_SECTION_OPTIONS);
  const nextPermissions = sanitizeStringList(permissions);

  const config = await PanelConfig.findOneAndUpdate(
    { role },
    {
      role,
      visibleSections: nextVisibleSections,
      permissions: nextPermissions,
      updatedBy: req.user?._id,
      updatedAt: new Date(),
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  res.json({ message: "Panel config updated", config: buildPanelConfigResponse(role, config) });
};

export const getPanelConfig = async (req, res) => {
  const { role } = req.params;
  if (!role || !CONFIG_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role for panel config" });
  }

  const config = await PanelConfig.findOne({ role });
  res.json({ config: buildPanelConfigResponse(role, config) });
};
