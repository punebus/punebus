import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signJwt } from "../utils/jwt.js";

const PANEL_ROLES = ["admin", "manager", "executor"];

// helper to sign token
const signToken = (user) => {
  return signJwt({ id: String(user._id), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const PROVIDER_ROLES = ["driver", "vendor", "parcel", "mechanic", "cleaner", "restaurant"];

// public registration for provider and field-support roles
export const registerUser = async (req, res) => {
  const {
    name,
    phone,
    email,
    role,
    AddharNo,
    address,
    documents,
    providerDescription,
    providerServices,
  } = req.body;

  if (!name || !phone || !role) {
    return res.status(400).json({ message: "name, phone and role are required" });
  }

  // disallow panel roles via public route
  if (PANEL_ROLES.includes(role)) {
    return res.status(403).json({ message: "Panel users can be created by admin only" });
  }

  const isProvider = PROVIDER_ROLES.includes(role);

  const user = new User({
    name,
    phone,
    email: email || undefined,
    role,
    AddharNo,
    address,
    documents,
    providerDescription: providerDescription || undefined,
    providerServices: Array.isArray(providerServices)
      ? providerServices.filter((item) => item && String(item).trim())
      : typeof providerServices === "string"
      ? providerServices
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined,
    approvalStatus: isProvider ? "pending" : "approved",
    isActive: isProvider ? false : true,
  });

  await user.save();
  const message = isProvider
    ? "Provider registration received. Approval pending."
    : `${role} registered successfully`;

  res.status(201).json({ message, user });
};

const loginByRole = async (req, res, role) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email, role });
  if (!user || !user.isActive || !user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
};

export const adminLogin = (req, res) => loginByRole(req, res, "admin");
export const managerLogin = (req, res) => loginByRole(req, res, "manager");
export const executorLogin = (req, res) => loginByRole(req, res, "executor");

export const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      isActive: req.user.isActive,
      approvalStatus: req.user.approvalStatus,
      providerDescription: req.user.providerDescription,
      providerServices: req.user.providerServices,
    },
  });
};
