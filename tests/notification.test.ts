import request from "supertest";
import app from "../src/app";
import { notifications } from "../src/store/notification.store";
import { seedNotifications } from "../src/services/notification.service";
import {
    createNotification,
} from "../src/services/notification.service";

describe("Notification API", () => {
    beforeEach(() => {
        notifications.length = 0;
        seedNotifications();
    });

    it("should return notifications for user1", async () => {

        const response = await request(app)
            .get("/notifications")
            .set("x-user-id", "user1");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should return 10 notifications for page 2", async () => {
        const response = await request(app)
            .get("/notifications?page=2&limit=10")
            .set("x-user-id", "user1");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(10);
    });

    it("should return only unread notifications", async () => {
        const firstResponse = await request(app)
            .get("/notifications")
            .set("x-user-id", "user1");

        const notificationId = firstResponse.body[0].id;

        await request(app)
            .post(`/notifications/${notificationId}/read`)
            .set("x-user-id", "user1");

        const response = await request(app)
            .get("/notifications?unread=true")
            .set("x-user-id", "user1");

        expect(response.status).toBe(200);

        response.body.forEach((notification: any) => {
            expect(notification.readAt).toBeNull();
        });
    });

    it("should mark a notification as read", async () => {
        const firstResponse = await request(app)
            .get("/notifications")
            .set("x-user-id", "user1");

        const notificationId = firstResponse.body[0].id;

        const response = await request(app)
            .post(`/notifications/${notificationId}/read`)
            .set("x-user-id", "user1");

        expect(response.status).toBe(200);
        expect(response.body.readAt).not.toBeNull();
    });

    it("should not allow user1 to mark user2 notification as read", async () => {
        const notification = createNotification({
            userId: "user2",
            kind: "job_succeeded",
            title: "User 2 notification",
            body: "This belongs to user2",
        });

        const response = await request(app)
            .post(`/notifications/${notification.id}/read`)
            .set("x-user-id", "user1");

        expect(response.status).toBe(404);
    });

    it("should mark only user1 notifications as read", async () => {
        const user2Notification = createNotification({
            userId: "user2",
            kind: "job_succeeded",
            title: "User 2 notification",
            body: "This belongs to user2",
        });

        await request(app)
            .post("/notifications/read-all")
            .set("x-user-id", "user1");

        const user2Response = await request(app)
            .get("/notifications?unread=true")
            .set("x-user-id", "user2");

        expect(user2Response.status).toBe(200);
        expect(user2Response.body.some(
            (notification: any) => notification.id === user2Notification.id
        )).toBe(true);
    });

    it("should reject invalid notification data", () => {
        expect(() =>
            createNotification({
                userId: "user1",
                kind: "",
                title: "Test notification",
                body: "Test body",
            })
        ).toThrow("Invalid notification data");
    });

    it("should only return notifications belonging to the requesting user", async () => {
        const user2Notification = createNotification({
            userId: "user2",
            kind: "job_succeeded",
            title: "User 2 notification",
            body: "This belongs to user2",
        });

        const response = await request(app)
            .get("/notifications")
            .set("x-user-id", "user1");

        expect(response.status).toBe(200);

        expect(
            response.body.some(
                (notification: any) => notification.id === user2Notification.id
            )
        ).toBe(false);
    });

    it("should not return more than 50 notifications", async () => {
        for (let i = 1; i <= 60; i++) {
            createNotification({
                userId: "user1",
                kind: "job_succeeded",
                title: `Test notification ${i}`,
                body: `Test body ${i}`,
            });
        }

        const response = await request(app)
            .get("/notifications?limit=100")
            .set("x-user-id", "user1");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(50);
    });
});