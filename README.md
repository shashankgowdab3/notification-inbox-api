# Notification Inbox API

REST API for managing user notifications using Node.js, TypeScript, Express.js, and Zod.

## Features

- Get notifications with pagination
- Unread notification filter
- Mark notification as read
- Mark all notifications as read
- User-level notification isolation
- Zod validation
- Automated tests

## API Endpoints

GET /notifications
Get user notifications.

POST /notifications/:id/read
Mark a notification as read.

POST /notifications/read-all
Mark all notifications as read.

All requests require the x-user-id header.

## Tech Stack

Node.js, TypeScript, Express.js, Zod, Jest, Supertest.

## Setup

npm install
npm run dev

Server runs on http://localhost:3000

## Testing

npm test

## Build

npm run build

Data is stored in memory and resets when the server restarts.