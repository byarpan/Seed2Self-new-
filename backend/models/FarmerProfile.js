import mongoose from "mongoose";

const farmerProfileSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true,
      index: true
    },
    farmerId: { type: String, unique: true, sparse: true },
    farmName: { type: String, trim: true },
    farmLocation: { type: String, trim: true },
    farmSize: { type: Number, min: 0 },
    farmSizeUnit: { 
      type: String, 
      enum: ["acres", "hectares", "sq_ft"], 
      default: "acres" 
    },
    cropsGrown: [{ type: String, trim: true }],
    farmingType: { 
      type: String, 
      enum: ["ORGANIC", "CONVENTIONAL", "HYBRID", "MIXED"], 
      default: "CONVENTIONAL" 
    },
    aadhaarNumber: { type: String, trim: true },
    aadhaarFrontPhoto: { type: String },
    aadhaarBackPhoto: { type: String },
    kycStatus: { 
      type: String, 
      enum: ["PENDING", "VERIFIED", "REJECTED"], 
      default: "PENDING" 
    },
    bankDetails: {
      accountName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifscCode: { type: String, trim: true },
      bankName: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

farmerProfileSchema.index({ farmerId: 1 });

const FarmerProfile = mongoose.models.FarmerProfile || mongoose.model("FarmerProfile", farmerProfileSchema);
export default FarmerProfile;
