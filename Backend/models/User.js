import mongoose from "mongoose";

export const USER_ROLES = [
  "driver",
  "vendor",
  "mechanic",
  "cleaner",
  "admin",
  "manager",
  "executor",
  "restaurant",
  "parcel",
];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: false },
  email: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: false }, // for admin or if user sets password
  role: {
    type: String,
    enum: USER_ROLES,
    required: true,
  },
  AddharNo: { type: String }, // optional for drivers/vendors
  address: { type: String },
  documents: { type: Object }, // store doc links or metadata
  providerDescription: { type: String },
  providerServices: [{ type: String }],
  approvalStatus: {
    type: String,
    enum: ["pending", "manager_approved", "approved", "rejected"],
    default: "approved",
  },
  approvalHistory: [
    {
      status: { type: String, enum: ["pending", "manager_approved", "approved", "rejected"] },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      updatedByRole: { type: String },
      note: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);
export default User;
