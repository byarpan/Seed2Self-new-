import mongoose from "mongoose";

// TODO: Define Customer Profile Schema
const customerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deliveryAddresses: [{ type: String }],
    preferredCategories: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.models.CustomerProfile || mongoose.model("CustomerProfile", customerProfileSchema);
