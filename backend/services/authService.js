import User from "../models/User.js";
import FarmerProfile from "../models/FarmerProfile.js";

/**
 * Register a new Farmer user and create initial FarmerProfile
 */
export const registerFarmer = async (userData) => {
  const { email, password, name, mobileNumber, farmName, farmLocation, landArea, mainCrops } = userData;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("User already exists with this email address");
  }

  const farmerId = `FAR-${Date.now()}`;

  const user = new User({
    name,
    email: email.toLowerCase(),
    password,
    role: "FARMER",
    mobileNumber,
    farmerId,
    farmName,
    farmLocation,
    landArea,
    mainCrops
  });

  await user.save();

  const profile = new FarmerProfile({
    userId: user._id,
    farmerId,
    farmName,
    farmLocation,
    cropsGrown: mainCrops ? mainCrops.split(",").map(c => c.trim()) : []
  });

  await profile.save();

  return { user, profile };
};

/**
 * Authenticate Farmer user credentials
 */
export const authenticateFarmer = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase(), role: "FARMER" });
  if (!user) {
    throw new Error("Farmer account not found");
  }

  if (user.password !== password) {
    throw new Error("Invalid password credentials");
  }

  const profile = await FarmerProfile.findOne({ userId: user._id });
  return { user, profile };
};

/**
 * Fetch Farmer profile details
 */
export const getFarmerProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const profile = await FarmerProfile.findOne({ userId: user._id });
  return { user, profile };
};

export default {
  registerFarmer,
  authenticateFarmer,
  getFarmerProfile
};
