import authService from "../services/authService.js";

/**
 * Register new Farmer
 * POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  try {
    const result = await authService.registerFarmer(req.body);
    res.status(201).json({
      success: true,
      message: "Farmer registered successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Login Farmer
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }
    const result = await authService.authenticateFarmer(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

/**
 * Get current Farmer profile
 * GET /api/auth/profile/:userId
 */
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await authService.getFarmerProfile(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

export default {
  registerUser,
  loginUser,
  getProfile
};
