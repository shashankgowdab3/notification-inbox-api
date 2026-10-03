import { Notification } from "../models/notification.model";
import { notifications } from "../store/notification.store";
import { createNotificationSchema } from "../validators/notification.validator";

export function getNotifications(
  userId: string,
  page: number,
  limit: number,
  unread: boolean
) {
  let userNotifications = notifications.filter(
    (notification) => notification.userId === userId
  );

  if (unread) {
    userNotifications = userNotifications.filter(
      (notification) => notification.readAt === null
    );
  }

  userNotifications.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const start = (page - 1) * limit;
  const end = start + limit;

  return userNotifications.slice(start, end);
}

export function createNotification(data: {
  userId: string;
  kind: string;
  title: string;
  body: string;
  resourceType?: string;
  resourceId?: string;
}) {

  const result = createNotificationSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Invalid notification data");
  }

  const notification: Notification = {
    id: crypto.randomUUID(),
    userId: data.userId,
    kind: data.kind,
    title: data.title,
    body: data.body,
    resourceType: data.resourceType,
    resourceId: data.resourceId,
    readAt: null,
    createdAt: new Date()
  };

  notifications.push(notification);

  return notification;
}

export function markAsRead(userId: string, notificationId: string) {
  const notification = notifications.find(
    (notification) =>
      notification.id === notificationId &&
      notification.userId === userId
  );

  if (!notification) {
    return null;
  }

  notification.readAt = new Date();

  return notification;
}


export function markAllAsRead(userId: string) {
  notifications.forEach((notification) => {
    if (notification.userId === userId) {
      notification.readAt = new Date();
    }
  });
}

export function seedNotifications() {
  for (let i = 1; i <= 25; i++) {
    const notification = createNotification({
      userId: "user1",
      kind: "job_succeeded",
      title: `Notification ${i}`,
      body: `This is notification ${i}`
    });

    notification.createdAt = new Date(
      Date.now() - (25 - i) * 1000
    );
  }

  createNotification({
    userId: "user2",
    kind: "job_succeeded",
    title: "User 2 notification",
    body: "This belongs to user2"
  });
}