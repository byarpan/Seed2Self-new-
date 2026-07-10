import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      required: true, 
      enum: ["FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER", "CUSTOMER", "ADMIN"] 
    },
    walletAddress: { type: String },
    profilePhoto: { type: String },
    farmerId: { type: String },
    processorId: { type: String },
    mobileNumber: { type: String },
    dob: { type: Date },
    gender: { type: String },
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
    kycStatus: { type: String, default: "PENDING" }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
