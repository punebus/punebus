import mongoose from "mongoose";

const panelConfigSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["manager", "executor"],
      required: true,
      unique: true,
    },
    visibleSections: [{ type: String }],
    permissions: [{ type: String }],
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PanelConfig = mongoose.model("PanelConfig", panelConfigSchema);
export default PanelConfig;
