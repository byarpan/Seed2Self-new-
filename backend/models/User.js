import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"],
      trim: true
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: { 
      type: String, 
      required: [true, "Password is required"] 
    },
    role: { 
      type: String, 
      required: true, 
      enum: ["FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER", "CUSTOMER", "ADMIN"],
      default: "FARMER"
    },
    walletAddress: { type: String, trim: true },
    profilePhoto: { type: String },
    farmerId: { type: String, index: true },
    processorId: { type: String },
    mobileNumber: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    permanentAddress: { type: String },
    state: { type: String },
    district: { type: String },
    village: { type: String },
    pinCode: { type: String },
    farmName: { type: String },
    farmLocation: { type: String },
    landArea: { type: String },
    mainCrops: { type: String },
    farmingType: { type: String },
    aadhaarNumber: { type: String },
    kycStatus: { 
      type: String, 
      enum: ["PENDING", "VERIFIED", "REJECTED"], 
      default: "PENDING" 
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.index({ farmerId: 1 });
userSchema.index({ walletAddress: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
