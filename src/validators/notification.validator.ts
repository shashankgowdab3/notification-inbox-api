import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  kind: z.string().min(1, "kind is required"),
  title: z.string().min(1, "title is required"),
  body: z.string().min(1, "body is required"),
  resourceType: z.string().optional(),
  resourceId: z.string().optional()
});