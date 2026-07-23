import Notification from "../models/Notification.js";

/**
 * Send a notification to a farmer/user
 */
export const createNotification = async (notificationData) => {
  const { userId, userStringId, title, message, type, link } = notificationData;

  if (!userId || !title || !message) {
    throw new Error("Missing required notification fields: userId, title, message");
  }

  const notification = new Notification({
    userId,
    userStringId: userStringId || userId.toString(),
    title,
    message,
    type: type || "SYSTEM",
    link,
    isRead: false
  });

  await notification.save();
  return notification;
};

/**
 * Get all notifications for a user/farmer
 */
export const getUserNotifications = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

/**
 * Mark all notifications as read for user
 */
export const markAllAsReadForUser = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { success: true };
};

export default {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllAsReadForUser
};
