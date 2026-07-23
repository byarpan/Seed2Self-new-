import authService from "../services/authService.js";
import User from "../models/User.js";

/**
 * Create user (Farmer)
 * POST /api/users
 */
export const createUser = async (req, res) => {
  try {
    const result = await authService.registerFarmer(req.body);
    res.status(201).json(result.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get all users
 * GET /api/users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createUser,
  getUsers,
  getUserById
};
