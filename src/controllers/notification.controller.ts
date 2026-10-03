import { Request, Response } from "express";
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} from "../services/notification.service";

export function getNotificationsController(req: Request, res: Response) {
  const userId = req.header("x-user-id");

  if (!userId) {
    return res.status(400).json({ message: "x-user-id is required" });
  }

  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const unread = req.query.unread === "true";

  const result = getNotifications(
    userId,
    page,
    limit,
    unread
  );

  return res.json(result);
}

export function markAsReadController(req: Request, res: Response) {
  const userId = req.header("x-user-id");
  const notificationId = req.params.id as string;

  if (!userId) {
    return res.status(400).json({ message: "x-user-id is required" });
  }

  const notification = markAsRead(userId, notificationId);

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  return res.json(notification);
}

export function markAllAsReadController(req: Request, res: Response) {
  const userId = req.header("x-user-id");

  if (!userId) {
    return res.status(400).json({ message: "x-user-id is required" });
  }

  markAllAsRead(userId);

  return res.json({ message: "All notifications marked as read" });
}