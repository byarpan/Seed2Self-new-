import notificationService from "../services/notificationService.js";

/**
 * Get user notifications
 * GET /api/notifications?userId=...
 */
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Mark a notification as read
 * PUT /api/notifications/:id/read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markNotificationAsRead(id);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Mark all user notifications as read
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }
    const result = await notificationService.markAllAsReadForUser(userId);
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead
};
