import { Router } from "express";

import {
  getNotificationsController,
  markAsReadController,
  markAllAsReadController,
} from "../controllers/notification.controller";

const router = Router();

router.get("/notifications", getNotificationsController);

router.post("/notifications/:id/read", markAsReadController);

router.post("/notifications/read-all", markAllAsReadController);

export default router;