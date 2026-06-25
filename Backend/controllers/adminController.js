// controllers/adminController.js
import bcrypt from "bcryptjs";
import User, { USER_ROLES } from "../models/User.js";

const PANEL_ROLES = ["admin", "manager", "executor"];

const normalizeEmail = (email) => {
  const value = String(email || "").trim().toLowerCase();
  return value || undefined;
};

/** createUserByAdmin already in your code - keep it. (I'll include it here for completeness) */
export const createUserByAdmin = async (req, res) => {
  const { name, phone, role, password, AddharNo, address, documents } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!name || !phone || !role) {
    return res.status(400).json({ message: "name, phone and role required" });
  }

  if (!USER_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (role === "admin") {
    return res.status(403).json({ message: "Cannot create another admin user" });
  }

  if (PANEL_ROLES.includes(role) && (!email || !password)) {
    return res.status(400).json({ message: "Email and password are required for panel users" });
  }

  // prevent creating duplicate email if provided
  if (email) {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });
  }

  let hashed = undefined;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashed = await bcrypt.hash(password, salt);
  }

  const user = new User({
    name,
    phone,
    email,
    role,
    password: hashed,
    AddharNo,
    address,
    documents,
  });

  await user.save();
  res.status(201).json({ message: "User created by admin", user });
};

/** listByCategory — keep existing but with small safety checks */
export const listByCategory = async (req, res) => {
  const role = req.params.role; // driver, vendor, mechanic, cleaner, admin, manager, executor
  const { page = 1, limit = 20, search } = req.query;

  const query = {};
  if (role && role !== "all") {
    if (!USER_ROLES.includes(role)) return res.status(400).json({ message: "Invalid role" });
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(query);
  const users = await User.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });

  res.json({
    role: role || "all",
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    users,
  });
};

/** mechanicList wrapper */
export const mechanicList = async (req, res) => {
  req.params.role = "mechanic";
  return listByCategory(req, res);
};

/** New: get counts per role and totals */
export const getStats = async (req, res) => {
  // get counts for each role
  const roles = USER_ROLES;
  const counts = {};

  // use Promise.all for parallel counts
  const promises = roles.map(async (r) => {
    const c = await User.countDocuments({ role: r });
    counts[r] = c;
  });
  await Promise.all(promises);

  const total = await User.countDocuments({});
  res.json({ total, counts });
};

/** New: get single user by id */
export const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "User id required" });

  const user = await User.findById(id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
};

/** New: update user by admin */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  const existingUser = await User.findById(id);
  if (!existingUser) return res.status(404).json({ message: "User not found" });

  if (updates.role && !USER_ROLES.includes(updates.role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (updates.role === "admin") {
    return res.status(403).json({ message: "Cannot change role to admin" });
  }

  if ("email" in updates) {
    updates.email = normalizeEmail(updates.email);
  }

  if (updates.email) {
    // ensure unique email if changed
    const existing = await User.findOne({ email: updates.email, _id: { $ne: id } });
    if (existing) return res.status(409).json({ message: "Email already in use" });
  }

  // if password provided, hash it
  if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(updates.password, salt);
  } else {
    delete updates.password; // don't set empty
  }

  const nextRole = updates.role || existingUser.role;
  const nextEmail = updates.email === undefined ? existingUser.email : updates.email;
  const hasPassword = Boolean(updates.password || existingUser.password);
  if (PANEL_ROLES.includes(nextRole) && (!nextEmail || !hasPassword)) {
    return res.status(400).json({ message: "Email and password are required for panel users" });
  }

  const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User updated", user });
};

/** New: delete user */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
};
