import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

const PROVIDER_ROLES = ["driver", "vendor", "parcel", "mechanic", "cleaner", "restaurant"];

const isProviderRole = (role) => PROVIDER_ROLES.includes(role);

export const listProviders = async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const query = { role: { $in: PROVIDER_ROLES } };

  if (status) {
    query.approvalStatus = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { providerDescription: { $regex: search, $options: "i" } },
      { providerServices: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const total = await User.countDocuments(query);
  const providers = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  res.json({ total, page: parseInt(page, 10), limit: parseInt(limit, 10), providers });
};

export const getProviderById = async (req, res) => {
  const { id } = req.params;
  const provider = await User.findById(id).select("-password");
  if (!provider || !isProviderRole(provider.role)) {
    return res.status(404).json({ message: "Provider not found" });
  }
  res.json({ provider });
};

const pushApprovalHistory = (provider, status, user, note) => {
  provider.approvalHistory = provider.approvalHistory || [];
  provider.approvalHistory.push({
    status,
    updatedBy: user._id,
    updatedByRole: user.role,
    note: note || `${status} by ${user.role}`,
    timestamp: new Date(),
  });
};

const buildProviderEmail = (provider, status, note) => {
  const roleLabels = {
    driver: "driver",
    vendor: "bus vendor",
    parcel: "parcel vendor",
    mechanic: "mechanic",
    cleaner: "cleaner",
    restaurant: "restaurant partner",
  };
  const roleLabel = roleLabels[provider.role] || "provider";
  if (status === "approved") {
    return {
      subject: "PuneBus registration approved",
      text: `Hello ${provider.name},\n\nYour ${roleLabel} registration has been approved by PuneBus.${note ? `\n\nNote: ${note}` : ""}\n\nOur team will contact you for the next steps.\n\nPuneBus Team`,
    };
  }

  return {
    subject: "PuneBus registration update",
    text: `Hello ${provider.name},\n\nYour ${roleLabel} registration was not approved at this time.${note ? `\n\nReason: ${note}` : ""}\n\nYou can contact PuneBus for more details.\n\nPuneBus Team`,
  };
};

export const managerApproveProvider = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const provider = await User.findById(id);
  if (!provider || !isProviderRole(provider.role)) {
    return res.status(404).json({ message: "Provider not found" });
  }

  if (provider.approvalStatus === "approved") {
    return res.status(400).json({ message: "Provider is already approved" });
  }

  provider.approvalStatus = "manager_approved";
  provider.isActive = false;
  pushApprovalHistory(provider, "manager_approved", req.user, note || "Recommended for final admin approval");
  await provider.save();

  res.json({ message: "Provider sent for admin approval", provider });
};

export const approveProvider = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const provider = await User.findById(id);
  if (!provider || !isProviderRole(provider.role)) {
    return res.status(404).json({ message: "Provider not found" });
  }

  provider.approvalStatus = "approved";
  provider.isActive = true;
  pushApprovalHistory(provider, "approved", req.user, note);
  await provider.save();

  const email = buildProviderEmail(provider, "approved", note);
  const emailResult = await sendEmail({
    to: provider.email,
    subject: email.subject,
    text: email.text,
  });

  res.json({ message: "Provider approved", provider, emailSent: emailResult.sent });
};

export const rejectProvider = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const provider = await User.findById(id);
  if (!provider || !isProviderRole(provider.role)) {
    return res.status(404).json({ message: "Provider not found" });
  }

  provider.approvalStatus = "rejected";
  provider.isActive = false;
  pushApprovalHistory(provider, "rejected", req.user, note);
  await provider.save();

  const email = buildProviderEmail(provider, "rejected", note);
  const emailResult = await sendEmail({
    to: provider.email,
    subject: email.subject,
    text: email.text,
  });

  res.json({ message: "Provider rejected", provider, emailSent: emailResult.sent });
};

export const deleteProvider = async (req, res) => {
  const { id } = req.params;
  const provider = await User.findById(id);
  if (!provider || !isProviderRole(provider.role)) {
    return res.status(404).json({ message: "Provider not found" });
  }
  await User.findByIdAndDelete(id);
  res.json({ message: "Provider deleted" });
};
