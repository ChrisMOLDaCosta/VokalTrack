// src/utils/notificationHelper.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = '@vokaltrack_notifications';
const NOTIFICATION_COUNT_KEY = '@vokaltrack_notification_count';

export const saveNotification = async (notification) => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    let notifications = stored ? JSON.parse(stored) : [];
    notifications = [notification, ...notifications];
    if (notifications.length > 50) notifications = notifications.slice(0, 50);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    const unreadCount = notifications.filter(n => !n.isRead).length;
    await AsyncStorage.setItem(NOTIFICATION_COUNT_KEY, unreadCount.toString());
  } catch (error) {
    console.error('Error saving notification:', error);
  }
};

export const getNotifications = async () => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    let notifications = stored ? JSON.parse(stored) : [];
    notifications = notifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    const unreadCount = notifications.filter(n => !n.isRead).length;
    await AsyncStorage.setItem(NOTIFICATION_COUNT_KEY, unreadCount.toString());
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    let notifications = stored ? JSON.parse(stored) : [];
    notifications = notifications.map(n => ({ ...n, isRead: true }));
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    await AsyncStorage.setItem(NOTIFICATION_COUNT_KEY, '0');
  } catch (error) {
    console.error('Error marking all as read:', error);
  }
};

export const clearAllNotifications = async () => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    await AsyncStorage.setItem(NOTIFICATION_COUNT_KEY, '0');
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    let notifications = stored ? JSON.parse(stored) : [];
    notifications = notifications.filter(n => n.id !== notificationId);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    const unreadCount = notifications.filter(n => !n.isRead).length;
    await AsyncStorage.setItem(NOTIFICATION_COUNT_KEY, unreadCount.toString());
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};

export const getUnreadCount = async () => {
  try {
    const count = await AsyncStorage.getItem(NOTIFICATION_COUNT_KEY);
    return count ? parseInt(count) : 0;
  } catch (error) {
    return 0;
  }
};