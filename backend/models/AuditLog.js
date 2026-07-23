import mongoose from "mongoose";

// TODO: Define AuditLog Schema
const auditLogSchema = new mongoose.Schema(
  {
    performedBy: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
