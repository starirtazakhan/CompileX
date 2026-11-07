const STORAGE_KEY = "compilex_notifications";

export const getNotifications = () => {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
  } catch {
    return [];
  }
};

const saveNotifications = (notifications) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notifications)
  );

  window.dispatchEvent(
    new Event("compilex-notifications-updated")
  );
};

export const addNotification = ({
  title,
  message,
  type = "info"
}) => {
  const notification = {
    id: `${Date.now()}-${Math.random()}`,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };

  const notifications = getNotifications();

  saveNotifications([
    notification,
    ...notifications
  ].slice(0, 50));

  return notification;
};

export const markNotificationAsRead = (id) => {
  const notifications = getNotifications().map(
    (notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
  );

  saveNotifications(notifications);
};

export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications().map(
    (notification) => ({
      ...notification,
      read: true
    })
  );

  saveNotifications(notifications);
};

export const clearNotifications = () => {
  saveNotifications([]);
}; 