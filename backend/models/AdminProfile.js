import mongoose from "mongoose";

// TODO: Define Admin Profile Schema
const adminProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    adminLevel: { type: String, default: "SUPER_ADMIN" },
    permissions: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.models.AdminProfile || mongoose.model("AdminProfile", adminProfileSchema);
